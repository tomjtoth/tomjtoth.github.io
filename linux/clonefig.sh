#!/bin/bash


FSTAB=/etc/fstab


function add_to_fstab() {
    # shellcheck disable=SC2068
    printf '%-20s\t%-10s\t%-10s\t%s\t%s %s\n' $@ \
        >> $FSTAB
}


function log() {
        printf '\033[1m==> \033[93m%s\033[0m\n' "$*"
}

function err() {
    printf '\n\t\033[1;31mERROR\033[0m: \033[1m%s\033[0m\n\n' "$*"
}

function yolo() {
    sed -i 's/ALL$/NOPASSWD: ALL/m' $SUDO_CONF
    sudo -u \#1000 "$@"
    sed -i 's/NOPASSWD: ALL$/ALL/m' $SUDO_CONF
}


function join_by_char() {
    local IFS="$1"
    shift
    echo "$*"
}


# shellcheck disable=SC2046
if [ $(id -u) -ne 0 ]; then
	err this script is to be run as root
	exit 1
fi


JOURNAL_CONF=/etc/systemd/journald.conf.d/00-journal-size.conf
if [ ! -f $JOURNAL_CONF ]; then
    log configuring systemd journals

    mkdir ${JOURNAL_CONF%/*} 2>/dev/null
    printf '%s\n' [Journal] SystemMaxUse=50M \
        > $JOURNAL_CONF
fi


if ! grep -q LC_TIME /etc/locale.conf; then
    log setting localization

    LOCALES=(en_US fi_FI hu_HU sv_FI)
    for lcl in "${!LOCALES[@]}"; do
        printf '%i - %s\n' "$lcl" "${LOCALES[$lcl]}"
    done

    while true; do
        read -erp "pick default locale: " lcl_idx
        # it's a number and is less than the LOCALES.length
        [[ \
            "$lcl_idx" =~ ^[0-9]+$ && \
            $lcl_idx -lt ${#LOCALES[@]} \
        ]] && break
        log err invalid index
    done

    printf '%s=en_US.UTF-8\n' LANG LANGUAGE LC_MESSAGES \
        > /etc/locale.conf

    printf 'LC_%s='"${LOCALES[$lcl_idx]}"'.UTF-8\n' \
        ADDRESS \
        COLLATE \
        CTYPE \
        IDENTIFICATION \
        MEASUREMENT \
        MONETARY \
        NAME \
        NUMERIC \
        PAPER \
        TELEPHONE \
        TIME \
        >> /etc/locale.conf
fi


if ! grep -q /dev/zram0 $FSTAB; then
    log enabling swap on zram

    RAM_100=$(free --mega | awk '/Mem:/ {print $2}')
    RAM_020=$(( RAM_100 * 2 / 10))M

    printf "zram" > /etc/modules-load.d/zram.conf
    printf '%s, %s, %s, %s, %s, %s\n' \
        'ACTION=="add"' \
        'KERNEL=="zram0"' \
        'ATTR{comp_algorithm}="zstd"' \
        'ATTR{disksize}="'$RAM_020'"' \
        'RUN="/usr/bin/mkswap -U clear /dev/%k"' \
        'TAG+="systemd"' \
        > /etc/udev/rules.d/99-zram.rules
    add_to_fstab /dev/zram0 none swap defaults,pri=100,discard 0 0
fi


SUDO_CONF=/etc/sudoers.d/99_wheel
if [ ! -f $SUDO_CONF ]; then
    log configuring sudoers

    printf '%s\n' \
        "# users in group wheel" \
        "%wheel ALL=(ALL:ALL) ALL" \
        > $SUDO_CONF
    chmod 0440 $SUDO_CONF
fi


if ! grep -q :1000: /etc/passwd; then
    log "adding primary user"

    mapfile -t EXISTING_USERS < <(cut -d':' -f 1 < /etc/passwd)
    while true; do
        read -erp "type primary username: " USERNAME
        [[ " ${EXISTING_USERS[*]} " != *" $USERNAME "* ]] && break
        log err "${USERNAME} is already taken, try another one!"
    done
    useradd -m -G wheel "$USERNAME"
    passwd "$USERNAME"
fi


pkgs=(

    # cli utils
    nano mc htop ncdu networkmanager ntp pacman-contrib bluez-utils man-db ntfs-3g os-prober

    # Desktop Environment
    gdm gnome-shell gnome-keyring eog nautilus file-roller
    gnome-terminal
    gnome-control-center
    gnome-shell-extension-appindicator
    gnome-shell-extension-caffeine
    xdg-desktop-portal-gnome
    gnome-browser-connector
    gnome-calculator gnome-tweaks
    ttf-dejavu

    # gui utils
    evince vlc geany geany-plugins keepassxc

    # video editing
    obs-studio avidemux-qt

    # Web
    firefox chromium qbittorrent

    # coding
    code docker docker-buildx docker-compose

    # openCL
    intel-compute-runtime clinfo clpeak 
    
    boinc-nox boinctui

)
mapfile -t missing_pkgs < <(diff -B --changed-group-format='%<'\
    --unchanged-group-format='' \
    <(printf "%s\n" "${pkgs[@]}" | sort) \
    <(printf "%s\n" "$(pacman -Qenq)" | sort) 
)
if [ ${#missing_pkgs[@]} -ne 0 ]; then
    log installing packages

    sed -i \
        -e 's/^#Color$/Color/m' \
        -e 's/^NoProgressBar$/#NoProgressBar/m' \
        -e 's/^#CheckSpace$/CheckSpace/m' \
        -re 's/^(ParallelDownloads *=) *[0-9]+$/\1 20/m' \
        /etc/pacman.conf
    pacman -Syyu "${missing_pkgs[@]}"
fi


if [ -z "$(which paru 2>/dev/null)" ]; then
    log installing paru

    sed -i \
        's/^#MAKEFLAGS="-j2"$/MAKEFLAGS="-j'"$(nproc)"'"/m' \
        /etc/makepkg.conf

    mkdir /tmp/clonefig
    cd /tmp/clonefig
    curl -O https://aur.archlinux.org/cgit/aur.git/snapshot/paru.tar.gz
    tar -xvzf paru.tar.gz
    chown -R 1000 .
    cd paru
    yolo makepkg -si --noconfirm
    cd ..
    rm -rf paru{,.tar.gz}
fi


SSH_WHEEL_CONF=/etc/ssh/sshd_config.d/01_wheel.conf
if [ ! -f $SSH_WHEEL_CONF ]; then
    log configuring SSH

    printf '%-20s %s\n' \
        Port "${SSH_PORT:-55522}" \
        AllowGroups wheel \
        PermitRootLogin no \
        > $SSH_WHEEL_CONF
fi


if ! grep -q '^AutomaticLoginEnable=True$' /etc/gdm/custom.conf; then
    log enabling autologin in GNOME

    sed -i '/^\[daemon\]$/aAutomaticLogin='"$USERNAME"'\nAutomaticLoginEnable=True' \
        /etc/gdm/custom.conf
fi


if [ "$(systemctl is-enabled gdm)" != "enabled" ]; then
    log enabling services

    for svc in docker gdm ntpd bluetooth NetworkManager; do
        systemctl enable $svc
    done
fi


if [ -d /var/lib/docker ]; then
    log relocating docker to /home

    systemctl stop docker
    mv /var/lib/docker /home
    ln -s /home/docker /var/lib/docker
    systemctl start docker
fi


# shellcheck disable=SC2016
echo '

# getting the latest aliases online
source <(curl -sSL https://tomjtoth.github.io/linux/bash_aliases) 2>/dev/null

# and weekly reminders
source <(curl -sSL https://tomjtoth.github.io/linux/reminders.sh) 2>/dev/null

' >> ~/.bashrc

# this must be revised as selective keybindings should be passed on only
# sudo -u \#1000 curl -L ttj.hu/linux/dconf-dump | dconf load /

LVM_CONF=/etc/lvm/lvm.conf
if [ -f $LVM_CONF ]; then
    sed -i -E "s/^(\s*)#(\s*issue_discards)\s*=\s*0$/\1 \2 = 1/" $LVM_CONF
fi

log adding option discard to $FSTAB

UUIDs=($(lsblk -o uuid --filter 'ROTA != 1'))
UUIDs=$(join_by_char "|" ${UUIDs[@]:1})

sed -i -E "s/^(UUID=($UUIDs)\s+.+)(\s+[0-9]+\s+[0-9]+\s*)$/\1,discard \3/mg" $FSTAB


GRUB_CUSTOM=/etc/grub.d/40_custom
if ! $(grep -qP 'Shutdown|Restart' $GRUB_CUSTOM); then
    log adding GRUB menu entries
    
    printf '%s\n' \
        'menuentry "Restart" { reboot }' \
        'menuentry "Shutdown" { halt }' \
        >> $GRUB_CUSTOM
    grub-mkconfig -o /boot/grub/grub.cfg
fi

log DONE


# shellcheck disable=SC2188
<<SKIP_SWAPFILE
# swapfile
dd if=/dev/zero of=/swapfile bs=1M count=1k status=progress
chmod 0600 /swapfile
mkswap -U clear /swapfile
echo "/swapfile none swap defaults 0 0" >> $FSTAB
echo "vm.swappiness=10" > /etc/sysctl.d/99-swappiness.conf
SKIP_SWAPFILE


# shellcheck disable=SC2188
# conf_ntfs(){
#     fdisk -l
#     echo -ne "\nwhich partition (/dev/____)? "
#     local UUID sdXY
#     read sdXY
#     UUID=$(blkid | grep -Po '^\/dev\/'${sdXY}'.+UUID="\K[\w-]+(?=")')
#     [ -z $TEST_RUN ] && mkdir /home/$sdXY
#     [ -z $TEST_RUN ] && \
#         echo -e "\n# NTFS data partition" \
#             "\nUUID=$UUID	/home/$sdXY	ntfs	rw,user,auto,umask=0022,uid=1000,gid=1000,exec	0	2" >> $FSTAB
#     [ -n "$UUID" ] && [ -z $TEST_RUN ] && echo -e "\n# for dual booting" \
#         "\nGRUB_DISABLE_OS_PROBER=false" >> /etc/default/grub
# }


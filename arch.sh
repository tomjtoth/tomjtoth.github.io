#!/bin/bash

# This is to be launched from a fresh install


function add_to_fstab() {
    # shellcheck disable=SC2068
    printf '%-20s\t%-10s\t%-10s\t%s\t%s %s\n' $@ \
        >> /etc/fstab
}


function log() {
    if [ "$1" == "err" ]; then
        shift
        printf '\n\t\033[1;31mERROR\033[0m: \033[1m%s\033[0m\n\n' "$*"
    else
        printf '\033[1m==> \033[93m%s\033[0m\n' "$*"
    fi
}


function yolo() {
    sed -i 's/ALL$/NOPASSWD: ALL/m' $SUDO_CONF
    sudo -u \#1000 $@
    sed -i 's/NOPASSWD: ALL$/ALL/m' $SUDO_CONF
}


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


if ! grep -q /dev/zram0 /etc/fstab; then
    log enabling swap on zram

    printf "zram" > /etc/modules-load.d/zram.conf
    printf '%s, %s, %s, %s, %s, %s\n' \
        'ACTION=="add"' \
        'KERNEL=="zram0"' \
        'ATTR{comp_algorithm}="zstd"' \
        'ATTR{disksize}="1G"' \
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
    mc htop ncdu networkmanager ntp pacman-contrib bluez-utils

    # Desktop Environment
    gdm gnome-shell gnome-keyring eog nautilus file-roller
    gnome-shell-extension-appindicator
    xdg-desktop-portal-gnome
    gnome-browser-connector
    gnome-calculator

    # gui utlis
    evince vlc geany keepassxc ttf-dejavu

    # video editing
    obs-studio avidemux-qt

    # Web
    firefox chromium qbittorrent

    # coding
    code docker docker-compose

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
    [ ! -R TEST ] && pacman --noconfirm -Syyu "${missing_pkgs[@]}"
fi


if [ -z "$(which paru 2>/dev/null)" ]; then
    log installing paru

    sed -i \
        's/^#MAKEFLAGS="-j2"$/MAKEFLAGS="-j'"$(nproc)"'"/m' \
        /etc/makepkg.conf

    curl -O https://aur.archlinux.org/cgit/aur.git/snapshot/paru.tar.gz
    tar -xvzf paru.tar.gz
    cd paru || exit 1
    chown -R 1000 .
    [ ! -R TEST2 ] && yolo makepkg -si --noconfirm
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


if [ -d /var/lib/docker ]; then
    log relocating docker to /home

    mv /var/lib/docker /home
    ln -s /home/docker /var/lib/docker
fi


if [ "$(systemctl is-enabled gdm)" != "enabled" ]; then
    log enabling services

    for svc in docker gdm ntpd bluetooth NetworkManager; do
        systemctl enable $svc
    done
fi


# TODO: .bash_aliases
# sudo -u "$USERNAME" dconf load - < curl -L ttj.hu/dconf-dump


log DONE


# shellcheck disable=SC2188
<<SKIP_SWAPFILE
# swapfile
dd if=/dev/zero of=/swapfile bs=1M count=1k status=progress
chmod 0600 /swapfile
mkswap -U clear /swapfile
echo "/swapfile none swap defaults 0 0" >> /etc/fstab
echo "vm.swappiness=10" > /etc/sysctl.d/99-swappiness.conf
SKIP_SWAPFILE


# shellcheck disable=SC2188
<<TODO_NTFS
conf_ntfs(){
    fdisk -l
    echo -ne "\nwhich partition (/dev/____)? "
    local UUID sdXY
    read sdXY
    UUID=$(blkid | grep -Po '^\/dev\/'${sdXY}'.+UUID="\K[\w-]+(?=")')
    [ -z $TEST_RUN ] && mkdir /home/$sdXY
    [ -z $TEST_RUN ] && \
        echo -e "\n# NTFS data partition" \
            "\nUUID=$UUID	/home/$sdXY	ntfs	rw,user,auto,umask=0022,uid=1000,gid=1000,exec	0	2" >> /etc/fstab
    nano /etc/fstab
    [ -n "$UUID" ] && [ -z $TEST_RUN ] && echo -e "\n# for dual booting" \
        "\nGRUB_DISABLE_OS_PROBER=false" >> /etc/default/grub
}
TODO_NTFS

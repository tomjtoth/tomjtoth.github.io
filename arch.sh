#!/bin/bash

# This is to be launched from a fresh install
# 
# use curl -L ttj.hu/arch.sh | bash


function add_to_fstab() {
    # shellcheck disable=SC2068
    printf '%-20s\t%-10s\t%-10s\t%s\t%s %s\n' $@ \
        >> /etc/fstab
}


function log() {
    if [ "$1" == "err" ]; then
        shift
        printf '\033[1;31mERROR\033[0m: %s' "$@"
    else
        printf '\033[1m==> \033[0m\033[90m%s\033[0m%\n' "$@"
    fi
}


pkgs=(

    # cli utils
    mc htop ncdu networkmanager ntp pacman-contrib

    # Desktop Environment
    gdm gnome-shell gnome-keyring eog
    gnome-shell-extension-appindicator
    xdg-desktop-portal-gnome

    # gui utlis
    evince vlc geany

    # video editing
    obs-studio avidemux-qt

    # Web
    firefox chromium qbittorrent

    # coding
    code docker docker-compose

)
log installing packages
pacman --noconfirm -Syyu "${pkgs[@]}"


log adding primary user
mapfile -t EXISTING_USERS< <(cut -d':' -f 1 < /etc/passwd)
printf '\n=>set primary username:\n'
while true; do
    read -er USERNAME
    [[ " ${EXISTING_USERS[*]} " != *" $USERNAME "* ]] && break
    log err "${USERNAME} is already taken, try another one: "
done
useradd -m -G wheel "$USERNAME"


log configuring sudoers
SUDO_CONF=/etc/sudoers.d/01_wheel
printf '%s\n' \
    "# users in group wheel" \
    "%wheel ALL=(ALL:ALL) ALL" \
    > $SUDO_CONF
chmod 0440 $SUDO_CONF


log enabling autologin in GNOME
sed -i '/\[daemon\]/aAutomaticLogin='"$USERNAME"'\nAutomaticLoginEnable=True' \
    /etc/gdm/custom.conf


log setting makepkg flags
sed -i 's/#MAKEFLAGS="-j2"/MAKEFLAGS="-j'"$(nproc)"'"/' /etc/makepkg.conf
[ -n "$(which rustup)" ] && rustup default stable


log configuring SSH
printf '%-20s %s\n' \
    Port "${SSH_PORT:-55522}" \
    AllowGroups wheel \
    PermitRootLogin no \
    > /etc/ssh/sshd_config.d/01_wheel.conf


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


if [ ! -f /etc/locale.conf ]; then
    log setting localization

    LOCALES=(en_US fi_FI hu_HU sv_FI)
    for lcl in "${!LOCALES[@]}"; do
        printf '%i - %s\n' "$lcl" "${LOCALES[$lcl]}"
    done

    while true; do
        read -erp "pick default locale: " LCL_IDX
        # it's a number and is less than the LOCALES.length
        [[ "$LCL_IDX" =~ ^[[:digit:]]+$ && $LCL_IDX -lt ${#LOCALES[@]} ]] && break
        log err invalid index
    done

    printf '%s=en_US.UTF-8\n' LANG LANGUAGE LC_MESSAGES \
        > /etc/locale.conf

    printf 'LC_%s='"${LOCALES[$LCL_IDX]}"'.UTF-8\n' \
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


log configuring systemd journals
mkdir /etc/systemd/journald.conf.d
printf '%s\n' [Journal] SystemMaxUse=50M \
    > /etc/systemd/journald.conf.d/00-journal-size.conf


if [ -d /var/lib/docker ]; then
    log relocating docker to /home
    mv /var/lib/docker /home
    ln -s /home/docker /var/lib/docker
fi


log enabling services
for svc in docker gdm ntpd bluetooth NetworkManager; do
    systemctl enable $svc
done



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


# shellcheck disable=SC2188
<<RUN_AS_1000
log installing paru

curl -O https://aur.archlinux.org/cgit/aur.git/snapshot/paru.tar.gz
tar -xvzf paru.tar.gz
cd paru || exit 1
makepkg -sic --noconfirm

dconf load - < curl -L ttj.hu/dconf-dump
RUN_AS_1000

log DONE

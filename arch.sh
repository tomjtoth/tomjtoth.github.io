#!/bin/bash

echo test
exit 0

# install packages
pkgs=(

    # cli utils
    mc htop ncdu networkmanager ntp

    # Desktop Environment
    gdm gnome-shell gnome-keyring eog gnome-shell-extension-appindicator

    # gui utlis
    evince vlc geany

    # video editing
    obs-studio avidemux-qt

    # Web
    firefox chromium qbittorrent

    # coding
    code docker docker-compose

)
pacman -Syyu ${pkgs[@]}


# enable services
for svc in ntpd bluetooth NetworkManager; do
    systemctl enable $svc
done


# useradd
while true; do
    read -e -p "set primary username:" USERNAME
    [ -n "$USERNAME" ] && break
done
useradd -m -G wheel $USERNAME


# sudo
SUDO_CONF=/etc/sudoers.d/01_wheel
printf '%s\n' \
    "# users in group wheel" \
    "%wheel ALL=(ALL:ALL) ALL" \
    > $SUDO_CONF
chmod 0440 $SUDO_CONF


# SSH
printf '%-20s %s\n' \
    Port ${SSH_PORT:-55522} \
    AllowGroups wheel \
    PermitRootLogin no \
    > /etc/ssh/sshd_config.d/01_wheel.conf


# zram
printf "zram" > /etc/modules-load.d/zram.conf
printf 'ACTION=="add", KERNEL=="zram0", ATTR{comp_algorithm}="zstd", ATTR{disksize}="1G", RUN="/usr/bin/mkswap -U clear /dev/%k", TAG+="systemd"' \
    > /etc/udev/rules.d/99-zram.rules
printf '/dev/zram0 none swap defaults,pri=100,discard 0 0' \
    >> /etc/fstab


<<SKIP_SWAPFILE
# swapfile
dd if=/dev/zero of=/swapfile bs=1M count=1k status=progress
chmod 0600 /swapfile
mkswap -U clear /swapfile
echo "/swapfile none swap defaults 0 0" >> /etc/fstab
echo "vm.swappiness=10" > /etc/sysctl.d/99-sysctl.conf
SKIP_SWAPFILE




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

conf_locale(){
    if [ -z $LOCALE ]; then
        d2 --title "default locale" \
            --radiolist "default for all users" 12 40 3 \
            $(for i in ${!locales[@]}; do [ $i -eq 1 ] && SEL=off; echo $i ${locales[$i]} ${SEL:-on}; done)
        [ $exitcode -ne 0 ] && return
        LOCALE=${locales[$choice]}.UTF-8
    fi
    if [ -z $KEYMAP ]; then
        d2 --title "default keymap" \
            --inputbox "default for all users" 10 10 "${LOCALE%_*}"
        [ $exitcode -ne 0 ] && return
        KEYMAP=$choice
    fi
    localectl set-x11-keymap $KEYMAP
    [ -z $TEST_RUN ] && echo "KEYMAP=$KEYMAP" > /etc/vconsole.conf
    [ -z $TEST_RUN ] && for var in \
        CTYPE NUMERIC TIME COLLATE MONETARY PAPER \
        NAME ADDRESS TELEPHONE \
        MEASUREMENT IDENTIFICATION; do printf '%s\n' \
        'LANG=en_US.UTF-8' \
        'LC_MESSAGES=en_US.UTF-8' \
        'LC_'$var'='$LOCALE \
        > /etc/locale.conf
}

conf_users(){
    if [ ! -f /etc/sudoers.d/wheel ]; then
        [ -z $TEST_RUN ] && printf '%s\n' \
            '%wheel ALL=(ALL:ALL) ALL' \
            '%wheel ALL=(ALL:ALL) NOPASSWD:/usr/bin/radeontop,/usr/bin/radeon-profile,/usr/bin/intel_gpu_top' \
            '' \
            > /etc/sudoers.d/wheel
        chmod 0440 /etc/sudoers.d/wheel
    fi
    local -A wheelers
    while true; do
        d2 --title "adding users" \
            --inputbox "username" 10 30 test
        [ $exitcode -ne 0 ] && break
        local user=$choice
        users+=($user)
        d2 --title "user $user" \
            --yesno "also add to group wheel?" 10 30
        [ $exitcode -eq 0 ] && wheelers[$user]="-G wheel"
    done
    
    [ ${#users[@]} -gt 0 ] && \
        [[ ! " ${users[@]} " =~ " guest " ]] && \
        users+=(guest)
    
    clear
    for user in ${users[@]}; do
        d2 --title "adding users one by one" \
            --yesno "add user:${user}${wheelers[$user]:+\ngroup:wheel}?" 10 30
        if [ $exitcode -eq 0 ]; then
            $TEST_RUN useradd -m ${wheelers[$user]} $user
            $TEST_RUN mkdir -p /home/${user}/.config
            $TEST_RUN cp -a .config/{xfce4,Thunar} /home/${user}/.config
            echo -e "\ngive a password to $user\n"
            $TEST_RUN passwd $user
        else
            continue
        fi
        d2 --title "/home/$user/.config" \
            --yesno "copy initial configs for ${user}?" 10 30
        if [ $exitcode -eq 0 ]; then
            $TEST_RUN cp -a .config /home/$user
            for f in $(find /home/$user/.config/..home -maxdepth 1); do
                [[ ! " $f " =~ " \.{1,2} " ]] && \
                    $TEST_RUN ln -sf $f /home/$user/${f##*/}
            done
        fi
        GITHUB=/home/$user/.config/.tomjtoth
        d2 --title "$GITHUB" \
            --yesno "hook $user to GitHUB configs?" 10 30
        if [ $exitcode -eq 0 ]; then
            $TEST_RUN git clone https://github.com/tomjtoth/config $GITHUB
            for f in $(find $GITHUB -maxdepth 1); do
                [[ ! " $f " =~ " (\.{1,2}(home|git)?) " ]] && \
                    $TEST_RUN ln -sf $f /home/$user/${f##*/}
            done
        fi
        $TEST_RUN chown -hR $user:$user /home/$user
    done
}

conf_lxdm(){
    d2 --title "configuring LXDM" \
        --msgbox "set numlock and autologin at least" 10 20
    nano /etc/lxdm/lxdm.conf
}

conf_sshd(){
    [ $(id -g 1000) -ne 1000 ] && \
        d2 --msgbox "create the users first" 7 14 && \
        return
    d2 --title "allow users only?" \
        --yesno "this will block root login via keyfile" 14 30
    if [[ ! $(< /etc/ssh/sshd_config) =~ "^Port 44422" ]]; then
        local CONF=("Port 44422")
        if [ $exitcode -eq 0 ]; then
            CONF+=("PermitRootLogin no" "AllowUsers ${users[*]}")
            services+=(sshd)
        else
            CONF+=("PermitRootLogin prohibit-password")
            mkdir /root/.ssh
            cat id_ed25519_remotehelp.pub >> /root/.ssh/authorized_keys
        fi
        [ -z $TEST_RUN ] && \
            printf '%s\n' "${CONF[@]}" >> /etc/ssh/sshd_config
    fi
}

    conf_samba(){
    if [ -n "$(pacman -Qenq samba 2>/dev/null)" ]; then
        d2 --title "samba does not seem to be  installed" \
            --yesno "do you want to install it?" 14 30
        [ $exitcode -eq 0 ] && $TEST_RUN pacman --noconfirm -S samba || return
    fi
    SHARE=/home/dummyshare
    [ -z $TEST_RUN ] && [ ! -d $SHARE ] && mkdir $SHARE && chmod 0777 $SHARE
    
    [ -z $TEST_RUN ] &&\
        [[ ! $(cat /etc/samba/smb.conf) =~ "\[dummyshare\]" ]] &&\
        printf '%s\n' \
            '[global]' \
            '  unix extensions = no' \
            '  server role = standalone server' \
            '  map to guest = Bad Password' \
            '' \
            '[dummyshare]' \
            '  comment = Watch them movies dummy' \
            '  follow symlinks = yes' \
            '  wide links = yes' \
            '  path = '$SHARE \
            '  read only = yes' \
            '  guest ok = yes' \
        > /etc/samba/smb.conf
}

conf_services(){
    echo "blacklist pcspkr" > /etc/modprobe.d/nobeep.conf
    $TEST_RUN cp repeater-router/* /etc/systemd/system/
    while true; do
        d2 --title "systemd" \
            --checklist "enabling services/timers" 20 50 10 \
            $(for i in ${!services[@]}; do [ $(systemctl is-enabled ${services[$i]}) = "enabled" ] && state=on || state=off; echo $i ${services[$i]} $state; done)
        if [ $exitcode -eq 0 ]; then
            for service in "${!services[@]}"; do
                if [[ " ${choice[@]} " =~ " $service " ]]; then
                    $TEST_RUN systemctl enable ${services[$service]}
                else
                    $TEST_RUN systemctl disable ${services[$service]}
                fi 
            done
            [ -n "$TEST_RUN" ] && echo "hit any key to continue" && read -n 1
        else
            break
        fi
    done
}

# launching things

if [ $# -eq 1 ] \
&& [[ " ${funcs[@]} " =~ " $1 " ]]; then
    $1
else
    menu
fi

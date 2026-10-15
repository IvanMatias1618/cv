#! /bin/bash

echo "Hola, Gestionare tus discos por ti :)"
echo "Veamos que discos tienes"
lsblk -fp
echo "Ahora veamos Tu fstab"
grep -oP 'UUID=\K[^ ]+' /etc/fstab

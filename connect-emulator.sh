#!/bin/bash

# Define variables for readability and easy modification
REMOTE_USER="sebastian"         # Replace with the username for the remote machine
REMOTE_IP="192.168.2.50"            # Replace with the IP address of the remote machine
ADB_PORT="5555"                     # Port used by adb on the remote machine

# Step 1: Create an SSH tunnel in the background, forwarding localhost:5555 to REMOTE_IP:5555
echo "Creating SSH tunnel to $REMOTE_IP on port $ADB_PORT..."
ssh -f -N -L ${ADB_PORT}:localhost:${ADB_PORT} ${REMOTE_USER}@${REMOTE_IP}

# Step 2: Connect adb to the emulator through the local tunnel
echo "Connecting adb to localhost:${ADB_PORT}..."
adb connect localhost:${ADB_PORT}

# Step 3: Verify the connection by listing connected devices
echo "Connected devices:"
adb devices

echo "Press ENTER to close the window."
read
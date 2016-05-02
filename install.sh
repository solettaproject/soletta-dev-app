#!/bin/bash

# This file is part of the Soletta Project
#
# Copyright (C) 2015 Intel Corporation. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

print_need_dep () {
    echo "Dependency not found: $1"
}

RETVAL=0
SYSTEMD_SERVICE_PATH="/etc/systemd/system"

test_dep () {
    SILENT=$2
    PKG_NAME=$3
    test=$(which $1)
    if [ -z "$test" ]; then
        if [ $SILENT -eq 0 ]; then
            print_need_dep $1
            exit 1
        fi
        RETVAL=1
    else
        RETVAL=0
    fi
}

if [ "$1" == "-h" ] || [ "$1" == "-help" ] || [ "$1" == "--help" ]; then
    echo "Usage: install.sh PATH"
    echo "  PATH: Installation path that soletta dev-app will be installed."
    echo "  If no path is provided, it will use the current dir of install.sh"
    exit 0
fi

test_dep "systemctl" 1
if [ $RETVAL -eq 1 ]; then
    print_need_dep "systemd"
    exit 1
fi

SYSTEMD_VERSION=$(systemctl show -p Version | cut -f 2 -d '=')
if [ $SYSTEMD_VERSION -lt 216 ]; then
   echo "Systemd version 216 or later is required"
   exit 1
fi

test_dep "node" 1
if [ $RETVAL -eq 1 ]; then
    test_dep "nodejs" 0 "nodejs"
    NODE_BIN_NAME="nodejs"
else
    NODE_BIN_NAME="node"
fi

FBP_RUNNER_PATH=$(which sol-fbp-runner)
if [ -z "$FBP_RUNNER_PATH" ]; then
    print_need_dep "soletta"
    echo "To install soletta: https://github.com/solettaproject/soletta/wiki#packages"
    exit 1
fi

FBP_DOT=$(which sol-fbp-to-dot)
test_dep "sol-fbp-to-dot" 1
if [ $RETVAL -eq 1 ]; then
    echo "Recompile soletta with FBP_TO_DOT support"
    exit 1
fi

test_dep "dot" 0 "graphviz"

test_dep "npm" 0 "npm"

test_dep "bower" 1 2>/dev/null
if [ $RETVAL -eq 1 ]; then
     print_need_dep "bower"
     echo "sudo npm install -g bower"
     exit 1
else
     BOWER=$(bower -v)
     if [ -z "$BOWER" ]; then
        echo "If you are running distro debian based machine run:"
        echo "sudo apt-get install nodejs-legacy"
        exit 1
    fi
fi

npm install
bower install

echo "Installing required services..."
SERVER_PATH=$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)
if [ -n "$1" ]; then
    cp -r $SERVER_PATH $1
    SERVER_PATH=$1
fi

su -c "cp $SERVER_PATH/scripts/units/fbp-runner@.service $SYSTEMD_SERVICE_PATH/ &&
       cp $SERVER_PATH/scripts/units/soletta-dev-app-server.service.in $SYSTEMD_SERVICE_PATH/soletta-dev-app-server.service &&
       sed -i "s@PATH@"$SERVER_PATH"@" $SYSTEMD_SERVICE_PATH/soletta-dev-app-server.service &&
       sed -i "s@"NODE_BIN_NAME"@"$NODE_BIN_NAME"@" $SYSTEMD_SERVICE_PATH/soletta-dev-app-server.service &&
       sed -i "s@"/usr/bin/sol-fbp-runner"@"$FBP_RUNNER_PATH"@" $SYSTEMD_SERVICE_PATH/fbp-runner@.service"
systemctl daemon-reload
echo "to start server run:"
echo "systemctl start soletta-dev-app-server"
exit 0

#!/bin/sh

# This file is part of the Soletta Project
#
# Copyright (C) 2015 Intel Corporation. All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
#
#   * Redistributions of source code must retain the above copyright
#     notice, this list of conditions and the following disclaimer.
#   * Redistributions in binary form must reproduce the above copyright
#     notice, this list of conditions and the following disclaimer in
#     the documentation and/or other materials provided with the
#     distribution.
#   * Neither the name of Intel Corporation nor the names of its
#     contributors may be used to endorse or promote products derived
#     from this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
# OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

print_need_dep () {
    echo "Dependency not found: $1"
}

RETVAL=0
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
fi

test_dep "sol-fbp-runner" 1
if [ $RETVAL -eq 1 ]; then
    print_need_dep "soletta"
    echo "To install soletta: https://github.com/solettaproject/soletta/wiki#packages"
    exit 1
fi

test_dep "dot" 0 "graphviz"

test_dep "npm" 0 "npm"

test_dep "bower" 1
if [ $RETVAL -eq 1 ]; then
     print_need_dep "bower"
     echo "sudo npm install -g bower"
     exit 1
fi

npm install
bower install
echo "Installing required services..."
SERVER_PATH=$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)
su -c "cp $SERVER_PATH/scripts/units/fbp-runner@.service /lib/systemd/system/"
su -c "cp $SERVER_PATH/scripts/units/soletta-dev-app-server.service.in /lib/systemd/system/soletta-dev-app-server.service"
su -c "sed -i "s@PATH@"$SERVER_PATH"@" /lib/systemd/system/soletta-dev-app-server.service"
systemctl daemon-reload
echo "to start server run:"
echo "systemctl start soletta-dev-app-server"
exit 0

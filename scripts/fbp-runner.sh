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
export SOL_LOG_PRINT_FUNCTION="journal"

if [ $# -eq 3 ]; then
    export SOL_FLOW_MODULE_RESOLVER_CONFFILE=$3
fi
USER_TMP="$2"
echo "USER_TMP="$USER_TMP
SERVICE="fbp-runner@"$(systemd-escape $USER_TMP)
echo "SERVICE="$SERVICE
SCRIPT="$USER_TMP/fbp_runner.fbp"
systemctl stop $SERVICE
if [ $1 == "start" ]; then
    syntax=`sol-fbp-runner -c $SCRIPT | grep OK`
    systemctl $1 $SERVICE
    if [ -n "$syntax" ]; then
	    exit 0
    else
	    exit 1
    fi
else
    st=`systemctl status $SERVICE | grep "Active:"`
    if [ -z "$st" ]; then
        exit 0
    else
        exit 1
    fi
fi

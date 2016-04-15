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
export SOL_LOG_PRINT_FUNCTION="journal"

SCRIPT="$3"
ENV_PATH="$2"
SERVICE="fbp-runner@"$(systemd-escape $ENV_PATH)

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

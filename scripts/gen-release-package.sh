#!/bin/bash

# This file is part of the Soletta Project
#
# Copyright (C) 2016 Intel Corporation. All rights reserved.
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

if [ $# -lt 1 ]; then
    echo "Missing git reference"
    exit 1
fi

PREFIX=soletta-dev-app
OUTPUT_TAR=soletta-dev-app.tar
OUTPUT_DIR=/tmp/
GIT_REF=$1

PACKAGE_NAME=soletta-dev-app_standalone_$GIT_REF.tar.gz

rm -rf $OUTPUT_DIR/$PACKAGE_NAME $OUTPUT_DIR/$OUTPUT_TAR $OUTPUT_DIR/$PREFIX

git archive --prefix $PREFIX"/" -o $OUTPUT_DIR"/"$OUTPUT_TAR $GIT_REF || exit 1

cd $OUTPUT_DIR && tar xf $OUTPUT_TAR && cd $PREFIX
npm install --production || exit 1
bower install || exit 1
cd $OUTPUT_DIR && tar czf $PACKAGE_NAME $PREFIX

rm -rf $OUTPUT_DIR/$OUTPUT_TAR $OUTPUT_DIR/$PREFIX

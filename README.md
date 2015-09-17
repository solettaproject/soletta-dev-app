[![Build Status](https://semaphoreci.com/api/v1/projects/dfb56eb8-5c48-4e73-955d-81872d744596/526934/shields_badge.svg)](https://semaphoreci.com/solettaproject/soletta-dev-app)<br>
[![npm version](https://badge.fury.io/js/soletta-dev-app.svg)](http://badge.fury.io/js/soletta-dev-app)

# Soletta Development Application

**Soletta Development Application** provides a web-based environment where developers can write, visualize, modify, run, test and debug their Soletta FBP programs. The Soletta Development Application is supposed to run on your target board and it then exposes the development environment through a web server application based on node.js.

FBP stands for Flow-Based Programming, which allows the programmer to express
business logic as a directional graph of nodes connected to type-specific ports.

**Soletta Project** is a framework for making IoT devices.
With Soletta Project's libraries developers can easily write software for
devices that control actuators/sensors and communicate using standard
technologies.
It enables adding smartness even on the smallest edge devices.

If you have any question or want to propose any a change contact the soletta
project on github: https://github.com/solettaproject/.

## Depedencies
 - *soletta*
 - *nodejs*
 - *npm*
 - *bower*
 - *systemd 216 or newer*
 - *graphviz*

## Dependencies Installation

##### Install Soletta

To get soletta and how to install [click here.](https://github.com/solettaproject/soletta/wiki#packages)

##### Install nodejs, npm and graphviz

To install on common linux distros:

##### Fedora:
        yum install nodejs npm graphviz

##### Arch:
        pacman -S nodejs npm graphviz

##### Ubuntu:
        apt-get install nodejs npm graphviz

##### Install bower (as root):
        npm install -g bower

## Soletta Developmet Application Installation

#### Automatic Installation (Recommended):

To install clone github repo or install it using npm:

        npm install soletta-dev-app

Run the install script in the root folder of the **Solletta Development Application** project

        ./install.sh

#### Manual Installation:

Clone the github repository and run the followings

##### Install back-end depedencies (as server user):
        npm install

##### Install front-end depedencies (as server user):
        bower install

##### Install services
Install the following service in your systemd:
 - *soletta-dev-app-server.service*
 - *fbp-runner@.service*

These services can be found in the folder scripts/units/.

The service soletta-dev-app-server needs to be renamed and edited before installing in the systemd.

Firstly, it is necessary to configure the server PATH inside of the service.

Open the service and replace the word PATH to the full path of the **Soletta Development Application**

Secondly, install the service with the name soletta-dev-app-server.service (Remove the .in suffix)


## Starting server
Run the following command:

        systemctl start soletta-dev-app-server.service

If start the server with systemd is unwanted, then run the following:

        node server/app.js

Depending of the nodejs installation the command might be:

        nodejs server/app.js

## Server configuration

The sever configuration file can be found on server/configuration.json

The configuration file has the following attributes:

    server_port:
         The port listened by the server. Default: 3000

    server_output:
          Choose if you want the server to show its output.
          Default: true

    server_user_home_dir:
          Choose where to store user repos.
          Default: /tmp

    server_tmp_dir:
          Choose where to store tmp files.
          Default: /tmp

    sessions_dir:
          Choose where to store sessions files.
          Default: ./sessions
          If the folder does not exists, it will be created.
          Where ./ means root of the server folder.

    journal_access:
          Allows users to access the journal tab.
          Default: true

    cheat_sheet_access:
         Allows users to access the cheat sheet tab.
          Default: true

    run_fbp_access:
          Allows users to run fbp files on server sheet tab.
          Default: true

    login_system:
          Enable the accounts system.
          (TODO)

    image_build:
          Allows users to generate image for target platform.
          (TODO).

    cheat_sheet_url:
          Choose from what url you want to load cheat sheet.
          Default: http://solettaproject.github.io/docs/nodetypes.

    journal_refresh_period:
          The journal refresh interval, in mileseconds
          Default 3000 ms

    fbp_service_status_refresh_period:
          The refresh period of the fbp runer service status, in miliseconds.
          Default 1000 ms

    save_file_period:
          Period that it will save your file when editing it
          Default: 5000 ms

    run_dialog_refresh_period:
          The refresh period of the output dialog, where stdout/stderr of
          running fbp file is displayed.
          Default: 1000 ms

    syntax_check_refresh_period:
          The refresh period of the syntax checker
          Default: 1100 ms

Whenever you make a change in the configuration file the server needs
to be restarted.

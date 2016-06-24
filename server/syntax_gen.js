module.exports = function () {
    var fs = require('fs');
    var path = require('path');
    var nodes = require('./nodetypes/nodetypes.js');

    var file_path = path.join(__dirname, '../client/libs/ace-builds/src-min/snippets/fbp.js');

    this.generateNodetypes = function() {
        try {
            var content = nodes.getNodeTypesName();
            var arrlen = content.length;
            var final = 'define(\"ace/snippets/fbp\",[\"require\",\"exports\",\"module\"],function(e,t,n){\"use strict\";t.snippetText=\"';
            var triggers = [];
            var names = [];

            generateSnippets();

            function generateSnippets() {
                generateStrings();
                for (var i = 0; i < arrlen; i++) {
                    final = final+ 'trigger '+ triggers.pop()+ '\\n'+ 'snippet '+ names.pop()+ '\\n\\t'+ content.pop()+ '\\n';
                }
                final = final+ '\",t.scope=\"fbp\"})';
                writetoFile(final);
            }

            function generateStrings() {
                var x = "";
                for (var i = 0; i < content.length; i++) {
                    var temp = content[i].split('/');
                    for (var j = 0; j < temp.length; j++) {
                        x = x + dash(temp[j].split('-'));
                    }
                    temp[0] = temp[0].toUpperCase();
                    if (temp[1]) {
                        temp[1] = temp[1].charAt(0).toUpperCase() + temp[1].slice(1);
                        names.push(temp[0] + ' '+ temp[1]);
                    } else {
                        names.push(temp[0]);
                    }
                    triggers.push(x);
                    x = "";
                }
            }

            function dash(arr) {
                var y = "";
                for (var k = 0; k < arr.length; k++) {
                    y = y + arr[k].slice(0,4);
                }
                return y;
            }
            
            function writetoFile(final_data){
                fs.writeFile(file_path, final_data, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("FBP snippets generated!");
                    }
                });
            }
        } catch (err) {
            console.log("Failed to get nodetypes");
        }
    }
}
module.exports = function () {
    var fs = require('fs');
    var path = require('path');
    var nodes = require('./nodetypes/nodetypes.js');

    var file_path = path.join(__dirname, '../client/libs/ace-builds/src-min/snippets/fbp.js');

    this.generateNodetypes = function() {
        var content = nodes.getNodeTypesName();
        var arrlen = content.length;
        var final = 'define(\"ace/snippets/fbp\",[\"require\",\"exports\",\"module\"],function(e,t,n){\"use strict\";t.snippetText=\"';
        var triggers = [];
        var names = [];

        fs.stat(file_path, function(err, stats) {
            if (err) {
                generateSnippets();
            }
            else {
                checkSnippets();
            }
        })

        function generateSnippets() {
            generateStrings();
            for (var i = 0; i < arrlen; i++) {
                final = final+ 'trigger '+ triggers.pop()+ '\\n'+ 'snippet '+ names.pop()+ '\\n\\t'+ content.pop()+ '\\n';
            }
            final = final+ '\",t.scope=\"fbp\"})';
            writetoFile(final);
        }

        function checkSnippets() {
            var count = 0, i = -1;
            var string = fs.readFileSync(file_path, 'utf8');
            while ((i = string.indexOf('\\t', i+1)) >= 0) {
                count ++;
            }
            if (count != arrlen) {
                fs.unlinkSync(file_path);
                generateSnippets();
            }
            else {
                console.log("No new nodetypes added!");
            }
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
                    names.push(temp[0]+' '+temp[1]);
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
            fs.appendFile(file_path, final_data, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("FBP snippets generated!");
                }
            });
        }
    }
}
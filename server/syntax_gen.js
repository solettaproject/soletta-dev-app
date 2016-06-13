module.exports = function () {
	var fs = require('fs');
	var path = require('path');
	var nodes = require('./nodetypes/nodetypes.js');

	var file_path = path.join(__dirname, '../client/libs/ace-builds/src-min/snippets/fbp.js');

	this.generateNodetypes = function() {
		var names = nodes.getNodeTypesName();
		var arrlen = names.length;
		var final = 'define(\"ace/snippets/fbp\",[\"require\",\"exports\",\"module\"],function(e,t,n){\"use strict\";t.snippetText=\"';
		var result = [];
		var x = "";

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
				final = final + 'snippet '+ result.pop()+ '\\n\\t'+ names.pop()+ '\\n';
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
			for (var i = 0; i < names.length; i++) {
				var temp = names[i].split('/');
				for (var j = 0; j < temp.length; j++) {
					x = x + dash(temp[j].split('-'));
				}
				result.push(x);
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
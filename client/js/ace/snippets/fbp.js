define("ace/snippets/fbp",["require","exports","module"], function(require,exports,module){
	"use strict";

exports.snippetText = "#IN\n\
snippet IN\n\
	IN\n\
#OUT\n\
snippet OU\n\
	OUT\n\
#inport\n\
snippet INP\n\
	INPORT\n\
#outport\n\
snippet OUTP\n\
	OUTPORT\n\
#boolean_true\n\
snippet TR\n\
	TRUE\n\
#boolean_false\n\
snippet FAL\n\
	FALSE\n\
#button\n\
snippet but\n\
	button\n\
snippet tog\n\
	toggle\n\
snippet acc\n\
	accelerometer/adxl345\n\
snippet accl\n\
	accelerometer/lsm303\n\
snippet ai\n\
	aio/reader\n\
snippet am2t\n\
	am2315/temperature\n\
snippet am2h\n\
	am2315/humidity\n\
snippet appargc\n\
	app/argc-argv\n\
snippet appargv\n\
	app/argv\n\
snippet appq\n\
	app/quit\n\
snippet appget\n\
	app/getenv\n\
snippet appset\n\
	app/setenv\n\
snippet appun\n\
	app/unsetenv\n\
snippet booa\n\
	boolean/and\n\
snippet booc\n\
	boolean/counter\n\
snippet boof\n\
	boolean/filter\n\
snippet boon\n\
	boolean/not\n\
snippet boor\n\
	boolean/or\n\
snippet boot\n\
	boolean/toggle\n\
snippet boox\n\
	boolean/xor\n\
snippet boobu\n\
	boolean/buffer\n\
snippet bytbita\n\
	byte/bitwise-and\n\
snippet bytbitn\n\
	byte/bitwise-not\n\
snippet bytbitor\n\
	byte/bitwise-or\n\
snippet bytshil\n\
	byte/shift-left\n\
snippet bytshir\n\
	byte/shift-right\n\
snippet bytbitx\n\
	byte/bitwise-xor\n\
snippet bytf\n\
	byte/filter\n\
snippet byteq\n\
	byte/equal\n\
snippet bytg\n\
	byte/greater\n\
snippet bytgre\n\
	byte/greater-or-equal\n\
snippet bytl\n\
	byte/less\n\
snippet bytleq\n\
	byte/less-or-equal\n\
snippet bytneq\n\
	byte/not-equal\n\
snippet calal\n\
	calamari/led\n\
snippet calale\n\
	calamari/lever\n\
snippet cala7\n\
	calamari/7seg\n\
snippet calargb\n\
	calamari/rgb-led\n\
snippet collu\n\
	color/luminance-rgb\n\
snippet compacc\n\
	compass/accelerometer-magnetometer\n\
snippet con\n\
	console\n\
snippet consbool\n\
	constant/boolean\n\
snippet consby\n\
	constant/byte\n\
snippet consfl\n\
	constant/float\n\
snippet consem\n\
	constant/empty\n\
snippet consint\n\
	constant/int\n\
snippet consrgb\n\
	constant/rgb\n\
snippet consdir\n\
	constant/direction-vector\n\
snippet consstr\n\
	constant/string\n\
snippet convboolf\n\
	converter/boolean-to-float\n\
snippet convboolb\n\
	converter/boolean-to-byte\n\
snippet convboolem\n\
	converter/boolean-to-empty\n\
snippet convboolint\n\
	converter/boolean-to-int\n\
snippet convboolstr\n\
	converter/boolean-to-string\n\
snippet convbytbit\n\
	converter/byte-to-bits\n\
snippet convbytbool\n\
	converter/byte-to-boolean\n\
snippet convbytflo\n\
	converter/byte-to-float\n\
snippet convbytemp\n\
	converter/byte-to-empty\n\
snippet convbytint\n\
	converter/byte-to-int\n\
snippet convbytrgb\n\
	converter/byte-to-rgb\n\
snippet convbytvec\n\
	converter/byte-to-direction-vector\n\
snippet convbytstr\n\
	converter/byte-to-string\n\
snippet convflobool\n\
	converter/float-to-boolean\n\
snippet convflobyt\n\
	converter/float-to-byte\n\
snippet convfloemp\n\
	converter/float-to-empty\n\
snippet convfloint\n\
	converter/float-to-int\n\
snippet convflorgb\n\
	converter/float-to-rgb\n\
snippet convflovec\n\
	converter/float-to-direction-vector\n\
snippet convflostr\n\
	converter/float-to-string\n\
snippet convempbool\n\
	converter/empty-to-boolean\n\
snippet convemprgb\n\
	converter/empty-to-rgb\n\
snippet convempbyt\n\
	converter/empty-to-byte\n\
snippet convempflo\n\
	converter/empty-to-float\n\
snippet convempint\n\
	converter/empty-to-int\n\
snippet convempstr\n\
	converter/empty-to-string\n\
snippet convintboo\n\
	converter/int-to-boolean\n\
snippet convintbyt\n\
	converter/int-to-byte\n\
snippet convintcom\n\
	converter/int-compose\n\
snippet convintdec\n\
	converter/int-decompose\n\
snippet convintflo\n\
	converter/int-to-float\n\
snippet convintemp\n\
	converter/int-to-empty\n\
snippet convintrgb\n\
	converter/int-to-rgb\n\
snippet convdirrgb\n\
	converter/direction-vector-to-rgb\n\
snippet convintvec\n\
	converter/int-to-direction-vector\n\
snippet convintstr\n\
	converter/int-to-string\n\
snippet convrgbbyt\n\
	converter/rgb-to-byte\n\
snippet convrgbflo\n\
	converter/rgb-to-float\n\
snippet convrgbint\n\
	converter/rgb-to-int\n\
snippet convdirvec\n\
	converter/rgb-to-direction-vector\n\
snippet convdirbyt\n\
	converter/direction-vector-to-byte\n\
snippet convdirflo\n\
	converter/direction-vector-to-float\n\
snippet convdirint\n\
	converter/direction-vector-to-int\n\
snippet convstrboo\n\
	converter/string-to-boolean\n\
snippet convstrbyt\n\
	converter/string-to-byte\n\
snippet convstrflo\n\
	converter/string-to-float\n\
snippet convstremp\n\
	converter/string-to-empty\n\
snippet convstrint\n\
	converter/string-to-int\n\
snippet converr\n\
	converter/error\n\
snippet convbitbyt\n\
	converter/bits-to-byte\n\
snippet convstrblo\n\
	converter/string-to-blob\n\
snippet convblostr\n\
	converter/blob-to-string\n\
snippet convtimestr\n\
	converter/timestamp-to-string\n\
snippet convstrtime\n\
	converter/string-to-timestamp\n\
snippet convblojobj\n\
	converter/blob-to-json-object\n\
snippet convjobjbol\n\
	converter/json-object-to-blob\n\
snippet convblojarr\n\
	converter/blob-to-json-array\n\
snippet convjarrblo\n\
	converter/json-array-to-blob\n\
snippet convstrjobj\n\
	converter/string-to-json-object\n\
snippet convstrjarr\n\
	converter/string-to-json-array\n\
snippet evdbool\n\
	evdev/boolean\n\
snippet filtread\n\
	file/reader\n\
snippet filtwrit\n\
	file/writer\n\
snippet filtbool\n\
	filter-repeated/boolean\n\
snippet filtbyt\n\
	filter-repeated/byte\n\
snippet filt\n\
	filter-repeated/error\n\
snippet filtrepfl\n\
	filter-repeated/float\n\
snippet filtrepint\n\
	filter-repeated/int\n\
snippet filtrgb\n\
	filter-repeated/rgb\n\
snippet filtrepve\n\
	filter-repeated/direction-vector\n\
snippet filtrepstr\n\
	filter-repeated/string\n\
snippet floaadd\n\
	float/addition\n\
snippet floadiv\n\
	float/division\n\
snippet floamod\n\
	float/modulo\n\
snippet floamul\n\
	float/multiplication\n\
snippet floasub\n\
	float/subtraction\n\
snippet floaabs\n\
	float/abs\n\
snippet floacon\n\
	float/constrain\n\
snippet floaln\n\
	float/ln\n\
snippet floamap\n\
	float/map\n\
snippet floamax\n\
	float/max\n\
snippet floami\n\
	float/min\n\
snippet floapo\n\
	float/pow\n\
snippet floasq\n\
	float/sqrt\n\
snippet floaeq\n\
	float/equal\n\
snippet floageq\n\
	float/greater-or-equal\n\
snippet floag\n\
	float/greater\n\
snippet floaleq\n\
	float/less-or-equal\n\
snippet floaless\n\
	float/less\n\
snippet floaneq\n\
	float/not-equal\n\
snippet floafil\n\
	float/filter\n\
snippet floawavtra\n\
	float/wave-generator-trapezoidal\n\
snippet floawaves\n\
	float/wave-generator-sinusoidal\n\
snippet floaclas\n\
	float/classify\n\
snippet forsel\n\
	form/selector\n\
snippet forbool\n\
	form/boolean\n\
snippet forint\n\
	form/int\n\
snippet forintc\n\
	form/int-custom\n\
snippet forstr\n\
	form/string\n\
snippet formstrf\n\
	form/string-formatted\n\
snippet gpior\n\
	gpio/reader\n\
snippet gpiow\n\
	gpio/writer\n\
snippet grotsen\n\
	grove/temperature-sensor\n\
snippet grolsen\n\
	grove/light-sensor\n\
snippet grorsen\n\
	grove/rotary-sensor\n\
snippet grolstr\n\
	grove/lcd-string\n\
snippet grolchar\n\
	grove/lcd-char\n\
snippet gyro\n\
	gyroscope/l3g4200d\n\
snippet iiogy\n\
	iio/gyroscope\n\
snippet iiomag\n\
	iio/magnet\n\
snippet iiot\n\
	iio/temperature\n\
snippet iiop\n\
	iio/pressure\n\
snippet iioc\n\
	iio/color\n\
snippet iioacc\n\
	iio/accelerate\n\
snippet iioh\n\
	iio/humidity\n\
snippet iioa\n\
	iio/adc\n\
snippet iiol\n\
	iio/light\n\
snippet intmax\n\
	int/max\n\
snippet intmin\n\
	int/min\n\
snippet intab\n\
	int/abs\n\
snippet intacc\n\
	int/accumulator\n\
snippet intadd\n\
	int/addition\n\
snippet intdiv\n\
	int/division\n\
snippet intmod\n\
	int/modulo\n\
snippet intmul\n\
	int/multiplication\n\
snippet intsub\n\
	int/subtraction\n\
snippet intbitand\n\
	int/bitwise-and\n\
snippet intbitnot\n\
	int/bitwise-not\n\
snippet intbitor\n\
	int/bitwise-or\n\
snippet intshl\n\
	int/shift-left\n\
snippet intshr\n\
	int/shift-right\n\
snippet intbit\n\
	int/bitwise-xor\n\
snippet intbu\n\
	int/buffer\n\
snippet inteq\n\
	int/equal\n\
snippet intg\n\
	int/greater\n\
snippet intgeq\n\
	int/greater-or-equal\n\
snippet intle\n\
	int/less\n\
snippet intleq\n\
	int/less-or-equal\n\
snippet intneq\n\
	int/not-equal\n\
snippet intcons\n\
	int/constrain\n\
snippet intfil\n\
	int/filter\n\
snippet intr\n\
	int/inrange\n\
snippet intm\n\
	int/map\n\
snippet jsonobj\n\
	json/object-get-key\n\
snippet json\n\
	json/object-get-path\n\
snippet jsonarrp\n\
	json/array-get-path\n\
snippet jsonobjlen\n\
	json/object-length\n\
snippet jsonobjkey\n\
	json/object-get-all-keys\n\
snippet jsonarrind\n\
	json/array-get-at-index\n\
snippet jsonarrlen\n\
	json/array-length\n\
snippet jsongetall\n\
	json/array-get-all-elements\n\
snippet jsoncrarr\n\
	json/create-array\n\
snippet jsoncrobj\n\
	json/create-object\n\
snippet jsonarr\n\
	json/create-array-path\n\
snippet jsonobj\n\
	json/create-object-path\n\
snippet keybbool\n\
	keyboard/boolean\n\
snippet keybint\n\
	keyboard/int\n\
snippet led7\n\
	led-7seg/led\n\
snippet ledchar\n\
	led-7seg/char-to-byte\n\
snippet ledlpd\n\
	led-strip/lpd8806\n\
snippet mag\n\
	magnetometer/lsm303\n\
snippet maxt\n\
	max31855/temperature\n\
snippet netwbool\n\
	network/boolean\n\
snippet perbool\n\
	persistence/boolean\n\
snippet perbyt\n\
	persistence/byte\n\
snippet perflo\n\
	persistence/float\n\
snippet perint\n\
	persistence/int\n\
snippet perstr\n\
	persistence/string\n\
snippet pie\n\
	piezo-speaker/sound\n\
snippet platf\n\
	platform\n\
snippet platftar\n\
	platform/set-target\n\
snippet platfhos\n\
	platform/hostname\n\
snippet platfclock\n\
	platform/system-clock\n\
snippet platftime\n\
	platform/timezone\n\
snippet platfloca\n\
	platform/locale\n\
snippet platfser\n\
	platform/service\n\
snippet platfid\n\
	platform/machine-id\n\
snippet powerli\n\
	power-supply/get-list\n\
snippet powercap\n\
	power-supply/get-capacity\n\
snippet powerinfo\n\
	power-supply/get-info\n\
snippet proin\n\
	process/stdin\n\
snippet proout\n\
	process/stdout\n\
snippet proerr\n\
	process/stderr\n\
snippet prosub\n\
	process/subprocess\n\
snippet pw\n\
	pwm\n\
snippet randbool\n\
	random/boolean\n\
snippet randbyt\n\
	random/byte\n\
snippet randflo\n\
	random/float\n\
snippet randint\n\
	random/int\n\
snippet serv\n\
	servo-motor/controller\n\
snippet strcomp\n\
	string/compare\n\
snippet strcon\n\
	string/concatenate\n\
snippet strlen\n\
	string/length\n\
snippet strsli\n\
	string/slice\n\
snippet strspl\n\
	string/split\n\
snippet strlow\n\
	string/lowercase\n\
snippet strup\n\
	string/uppercase\n\
snippet strstar\n\
	string/starts-with\n\
snippet strend\n\
	string/ends-with\n\
snippet strrep\n\
	string/replace\n\
snippet strregse\n\
	string/regexp-search\n\
snippet strregrep\n\
	string/regexp-replace\n\
snippet stru\n\
	string/uuid\n\
snippet strisemp\n\
	string/is-empty\n\
snippet strb64enc\n\
	string/b64encode\n\
snippet strb64dec\n\
	string/b64decode\n\
snippet strb16enc\n\
	string/b16encode\n\
snippet strb16dec\n\
	string/b16decode\n\
snippet stts\n\
	stts751/temperature\n\
snippet swiblo\n\
	switcher/blob\n\
snippet swibool\n\
	switcher/boolean\n\
snippet swibyt\n\
	switcher/byte\n\
snippet swiemp\n\
	switcher/empty\n\
snippet swierr\n\
	switcher/error\n\
snippet swiflo\n\
	switcher/float\n\
snippet swi.in\n\
	switcher/int\n\
snippet swirgb\n\
	switcher/rgb\n\
snippet swidir\n\
	switcher/direction-vector\n\
snippet swistr\n\
	switcher/string\n\
snippet switime\n\
	switcher/timestamp\n\
snippet temp\n\
	temperature/converter\n\
snippet test\n\
	test/result\n\
snippet testboolv\n\
	test/boolean-validator\n\
snippet testboolg\n\
	test/boolean-generator\n\
snippet testbytv\n\
	test/byte-validator\n\
snippet testbytg\n\
	test/byte-generator\n\
snippet testintv\n\
	test/int-validator\n\
snippet testintg\n\
	test/int-generator\n\
snippet testflog\n\
	test/float-generator\n\
snippet testflov\n\
	test/float-validator\n\
snippet testblobv\n\
	test/blob-validator\n\
snippet teststrg\n\
	test/string-generator\n\
snippet teststrv\n\
	test/string-validator\n\
snippet tim\n\
	timer\n\
snippet tim\n\
	timestamp/time\n\
snippet tim\n\
	timestamp/make-time\n\
snippet tim\n\
	timestamp/split-time\n\
snippet tim\n\
	timestamp/equal\n\
snippet timg\n\
	timestamp/greater\n\
snippet timge\n\
	timestamp/greater-or-equal\n\
snippet timl\n\
	timestamp/less\n\
snippet timle\n\
	timestamp/less-or-equal\n\
snippet timn\n\
	timestamp/not-equal\n\
snippet timd\n\
	timestamp/delta\n\
snippet trigc\n\
	trigonometry/cosine\n\
snippet trigdr\n\
	trigonometry/degrees-to-radian\n\
snippet trigrd\n\
	trigonometry/radian-to-degrees\n\
snippet trigs\n\
	trigonometry/sine\n\
snippet trigt\n\
	trigonometry/tangent\n\
snippet unixbw\n\
	unix-socket/boolean-writer\n\
snippet unixbr\n\
	unix-socket/boolean-reader\n\
snippet unixstrw\n\
	unix-socket/string-writer\n\
snippet unixstrr\n\
	unix-socket/string-reader\n\
snippet unixrgbw\n\
	unix-socket/rgb-writer\n\
snippet unixrgbr\n\
	unix-socket/rgb-reader\n\
snippet unixdvw\n\
	unix-socket/direction-vector-writer\n\
snippet unixdvr\n\
	unix-socket/direction-vector-reader\n\
snippet unixbw\n\
	unix-socket/byte-writer\n\
snippet unixbr\n\
	unix-socket/byte-reader\n\
snippet unixiw\n\
	unix-socket/int-writer\n\
snippet unixir\n\
	unix-socket/int-reader\n\
snippet unixfw\n\
	unix-socket/float-writer\n\
snippet unixfr\n\
	unix-socket/float-reader\n\
snippet updc\n\
	update/check\n\
snippet updf\n\
	update/fetch\n\
snippet updi\n\
	update/install\n\
snippet wallh\n\
	wallclock/hour\n\
snippet wallm\n\
	wallclock/minute\n\
snippet wallmo\n\
	wallclock/monthday\n\
snippet walls\n\
	wallclock/second\n\
snippet wallw\n\
	wallclock/weekday\n\
snippet wallt\n\
	wallclock/timeblock\n\
snippet wally\n\
	wallclock/year\n\
";
exports.scope="fbp";
});
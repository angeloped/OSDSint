var lang;

function loadScript() {
    var funct = function (key, val) {
        $(val).attr('id', key);
    }
    $('h2').each(funct)

    if ($('h2').length == 0) {
        $('h1').each(funct)
    }

    /*var indexF=window.location.href.lastIndexOf('favorite.html');
	if(indexF > -1){
		 shorten.init();
	}*/

}


function capitalizeEachWord(obj, func) {
    if (func != null && typeof (func) == "function") {
        func();
    }
}


function goto(id) {
    //alert(id);
    window.location.hash = '#' + id;
}

function getChapters() {
    var arr = [];
    var func = function (key, val) {
        arr.push($(val).text().toLowerCase().capitalize());
    }
    $('h2').each(func);

    if (arr.length == 0) {
        $('h1').each(func);
    }
    window.HtmlViewer.getChapters(JSON.stringify(arr));
}


function trans(key, val) {
    $(val).html(language[$(val).html()]);
}

function uppcase(key, val) {
    $(val).html($(val).html().toUpperCase());
}
function translate(code, func, id) {
    //alert(code);
    lang = code;

    if (lang == null || lang == '' || lang == 'en') {
        capitalizeEachWord('h2', func);
        return;
    }

    var url = '../language.' + code + '.js';
    url = 'file:///android_asset/language.' + code + '.js';
    getScript(url, function () {
        if (typeof (language) != "undefined") {
            var tags = ["h1", "h2", "label"];
            $.each(tags, function (key, val) {
                $(val).each(function (key1, val1) {
                    trans(key1, val1);
                    if (val != "label" && val != "a")
                        uppcase(key1, val1);
                });
                if (val == ".area label") {
                    conversion.refersh();
                }
            });

            $("a.morelink").each(trans);
            $('h3').each(trans);
            $('.btn-customized').each(trans);

            $('img[src*=en]').each(function (key, val) {
                $(val).attr('src', $(val).attr('src').replace('en', lang));
            });
            capitalizeEachWord('h2', func);

            $('.conversion input').each(function (key, val) {
                var value = conversion.format($(val).attr('data-unit'))
                $(val).val(value);
            });
        }
    }, function () {
        capitalizeEachWord('h2', func);
    });

    if (id && id > 0) goto(id);
}
function getHtmlParentImage(fullname) {
    var img = fullname.substring(fullname.lastIndexOf('/') + 1, fullname.length);
    $img = $('img[src="' + img + '"]');
    var path = fullname.substring(0, fullname.lastIndexOf('/') + 1)
    $img.parent().find('img').each(function (key, val) {
        var src = $(this).attr('src');
        if (lang != null && lang != '')
            src = src.replace(lang, "en");
        $(this).attr('src', path + src);
    });
    var parentHTML = $img.parent().html();
    parentHTML = parentHTML.replace(/[\n\r]/g, "");
    var $div = $('#clone');
    $div.html(parentHTML);

    var tags = ["h1", "h2", "h3"];
    $.each(tags, function (key, val) {
        $(val).each(function (key1, val1) {
            var $obj = $div.find(val1);
            $obj.html($obj.attr('key'));
        });
    });

    window.HtmlViewer.getHTML($div.html());
    //alert($div.html());
    $img.attr('src', img);
    $div.empty();
}

function removeFavorite(fullname) {
    $img = $('img[src="' + fullname + '"]');
    $img.parent().remove();
    sendHtmlToAndroid();
}

function sendHtmlToAndroid() {
    $('img[src*="?"]').each(function () {
        var img = $(this).attr('src');
        var index = img.indexOf('?')
        if (index > 0)
            img = img.substring(0, index);
        $(this).attr('src', img);
    });
    //console.log($('html')[0].outerHTML);
    window.HtmlViewer.getAllHTML($('html')[0].outerHTML);
}

function editFavorite(img) {
    var $div = $("img[src*='" + img + "']").parent();
    if ($div.length > 0) {
        var arr = [];
        arr.push($div.find('h2').text());
        var img = $div.find('img').attr('src');
        var index = img.indexOf('?')
        if (index > 0)
            img = img.substring(0, index);
        arr.push(img);
        arr.push("IMAGE")
        //console.log(JSON.stringify(arr));
        window.HtmlViewer.getContentEditFavorite(JSON.stringify(arr));
    }
}

function searchQuery(key) {
    if (key == null || key == '') {
        $('h1').show();
        $('div').show();
    } else {
        $('h1').hide();
        $('div').hide();

        $("div:contains('" + key + "')").show();
    }
}

function removeUnicode(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, "-");
    str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1-
    str = str.replace(/^\-+|\-+$/g, "");//cắt bỏ ký tự - ở đầu và cuối chuỗi
    return str;
}


jQuery.expr[':'].contains = function (a, i, m) {
    var x = removeUnicode(jQuery(a).text());
    var y = removeUnicode(m[3]);
    return x.indexOf(y) >= 0;
    //return jQuery(a).text().toUpperCase()
    //  .indexOf(m[3].toUpperCase()) >= 0;
};

function getScript(url, success, fail) {
    var script = document.createElement('script');
    script.src = url;
    var head = document.getElementsByTagName('head')[0],
		done = false;
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState
             || this.readyState == 'loaded'
             || this.readyState == 'complete')) {
            done = true;
            success();
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    };
    script.onerror = function () {
        fail();
    }
    head.appendChild(script);
}

function conversion(value, unit) {
    switch (unit) {
    }
}


String.prototype.capitalize = function () {
    return this.replace(/(^|\s)([a-z|đ|ứ|á])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); });
};

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    var regStr = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var regexp = new RegExp(regStr, 'g')
    return str.replace(regexp, replace);
};

//////////////////////////////////////
/////////// unit conversion//////////
////////////////////////////////////
var seper1 = ',';
var seper2 = '.';
var conversion = {
    format: function (value) {
        if (value > 10e+10) {
            return parseFloat(value).toExponential();
        }
        value = parseFloat(value).round(5);
        //return value;
        value = value + '';
        var x = value.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? seper2 + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + seper1 + '$2');
        }
        return x1 + x2;
    },

    bypass: function (value) {
        var dot = value.split(seper2).length;
        var lastchar = value.substr(value.length - 1, value.length);
        return dot === 2 && lastchar === seper2;
    },

    reformat: function (value) {
        var re = new RegExp('\\' + seper1, 'g');
        return value.replace(re, '');
    },
    loadUI: function (id, label, unit, isroot, root, form1, form2) {
        if (root) root = 'data-root="' + root + '"';
        if (form1) form1 = 'data-this-form="' + form1 + '"';
        if (form2) form2 = 'data-root-form="' + form2 + '"';
        if (!root) root = '';
        if (!form1) form1 = '';
        if (!form2) form2 = '';

        if (isroot)
            isroot = 'is-root';
        else
            isroot = '';

        var special = '';

        special = 'is-special ' + root + ' ' + form1 + ' ' + form2;
        $('#conversion').append('<div class="form-group col-xs-12 col-sm-6 col-md-6 col-lg-6">' +
            '<label for="' + id + '">' + label + '</label>' +
            '<input type="tel" id="' + id + '" class="clearable form-control" data-unit="' + unit + '" value="' + unit + '" step="1" ' + special + ' ' + isroot + '/>' +
            '</div>');
    },

    handler: {
        keyup: function (obj, e) {
            if (obj.keyCode == 190) {
                var dot = this.value.split(seper2).length;
                if (dot > 2) {
                    $(this).val(conversion.format(this.value));
                    return;
                }
            }
            if (obj.keyCode != 189) {
                var value = this.value;
                value = value.replace(/[^0-9\.\,\-]/g, '');
                value = conversion.reformat(value);
                $(this).val(value);
                if (!isNaN(value) && value != "" && !conversion.bypass(value)) {
                    value = conversion.reformat(value);
                    //$(this).val(conversion.format(value));
                    var unit = $(this).attr('data-unit');
                    var $base_root = $('input[data-unit=1][is-root]');
                    var base_root_value = value / unit;
                    conversion.setValue($base_root, base_root_value);

                    conversion.reloadDataUnit(base_root_value, unit);
                }
            } else {
                value = this.value;
                $(this).val(value.substr(0,value.length-1));
            }
            console.log(obj.keyCode);
        },
        special_keyup: function (obj, e) {
            if (obj.keyCode == 190) {
                var dot = this.value.split(seper2).length;
                if (dot > 2) {
                    $(this).val(conversion.format(this.value));
                    return;
                }
            }


            if (obj.keyCode != 189) {
                var value = this.value;
                value = value.replace(/[^0-9\.\,\-]/g, '');
                value = conversion.reformat(value);
                $(this).val(value);
                if (!isNaN(value) && value != "" && !conversion.bypass(value)) {
                    var $this = $(this);

                    if ($(this).attr('is-root') !== undefined) {
                        $('#conversion input[data-root="' + $this.attr('id') + '"]').each(function (key, val) {
                            var convertValue = eval($(val).attr('data-root-form').replace('root', 'parseFloat(value)'));
                            conversion.setValue($(val), convertValue);
                        });

                    } else {
                        var $root = $('#' + $(this).attr('data-root'));
                        var rootValue = eval($this.attr('data-this-form').replace('this', 'parseFloat(value)'));
                        conversion.setValue($root, rootValue);
                        $('#conversion input:not([id="' + $this.attr('id') + '"]):not([is-root])').each(function (key, val) {
                            var convertValue = eval($(val).attr('data-root-form').replace('root', 'parseFloat(rootValue)'));
                            conversion.setValue($(val), convertValue);
                        });
                    }
                }
            } else {
                value = this.value;
                $(this).val(value.substr(0, value.length - 1));
            }

        },
        convertOtherSpecial: function (key, val) {
            var convertValue = eval($(val).attr('data-form').replace('unit', 'parseFloat($base_root.val())'));
            $(val).val(conversion.format(convertValue));
        },
        change: function () {
            var unit = $(this).attr('data-unit');
            var $base_root = $('input[data-unit=1]');
            var base_root_value = conversion.reformat($(this).val()) / unit;
            $base_root.val(conversion.format(base_root_value));

            conversion.reloadDataUnit(base_root_value, unit);
        }
    },
    setValue: function ($this, value) {
        $this.val(conversion.format(value));
    },
    reloadDataUnit: function (rootValue, unit) {
        var handler = function (key, val) {
            var value = rootValue * $(val).attr('data-unit');
            conversion.setValue($(val), value);
        };
        $('input:not([data-unit="' + unit + '"])').each(handler);
    },

    refersh: function () {
        var formatInputHandler = function (key, val) {
            $(this).val(conversion.format($(this).val()));
        }
        $('#conversion input').each(formatInputHandler);
    },

    initialize: function () {
        $('#conversion .clearable').clearSearch();

        $('#conversion input').keyup(conversion.handler.keyup);
        $('#conversion input[is-root]').unbind('keyup').keyup(conversion.handler.special_keyup);
        $('#conversion input[data-root]').unbind('keyup').keyup(conversion.handler.special_keyup);
        conversion.refersh();
    }
};

var shorten = {
    showChar: 100,
    ellipsestext: "...",
    moretext: "more",
    lesstext: "less",
    selector: '.load-more',

    init: function () {

        $(shorten.selector).each(function () {
            var content = $(this).html();
            if (content.length > shorten.showChar) {
                var c = content.substr(0, shorten.showChar);
                var h = content.substr(shorten.showChar /*- 1*/, content.length - shorten.showChar);
                var html = c + '<span class="moreellipses">' + shorten.ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + shorten.moretext + '</a></span>';
                $(this).html(html);
            }

        });


        $(shorten.selector + " .morelink").click(function (e) {
            if ($(this).hasClass("less")) {
                $(this).removeClass("less");
                $(this).html(shorten.moretext);
            } else {
                $(this).addClass("less");
                $(this).html(shorten.lesstext);
            }
            $(this).parent().prev().toggle();
            $(this).prev().toggle();
            e.preventDefault();
            //return false;
        });
    },
    destroy: function () {
        $('.moreellipses').remove();
        $(shorten.selector).each(function () {
            $(this).find('.morelink').remove();
            var html = $(this).html();
            $(this).html(html.replace('<span class="morecontent">', '').replaceAll('<span>', '').replaceAll('</span>', '').replaceAll('&nbsp;', ''))
        });
    }
};

Number.prototype.round = function (places) {
    var value = Math.round(this + "e+" + places);
    if (isNaN(value)) return this;

    return +(value + "e-" + places);
}


function setupMovingFavorite() {
    $('div').each(function (key, val) {
        $(val).prepend('<input type="radio" class="checkbox" name="moving">')
    });
}

function doneMovingFavorite() {
    $('input').remove();
    shorten.destroy();
    sendHtmlToAndroid();
}

function upFavorive() {
    var $div = $('input:checked').parent();
    var $checked = $div.clone();
    if ($div.prev().length > 0) {
        $div.prev().before($checked);
        $div.remove();
    }
}

function downFavorive() {
    var $div = $('input:checked').parent();
    var $checked = $div.clone();
    if ($div.next().length > 0) {
        $div.next().after($checked);
        $div.remove();
    }
}

function getContentToEdit() {
    var $div = $('input:checked').parent().clone();
    if ($div.find('img').length > 0) {
        var arr = [];
        arr.push($div.find('h2').text());
        var img = $div.find('img').attr('src');
        var index = img.indexOf('?')
        if (index > 0)
            img = img.substring(0, index);
        arr.push(img);
        arr.push("IMAGE")
        //console.log(JSON.stringify(arr));
        window.HtmlViewer.getContentEditFavorite(JSON.stringify(arr));


    } else {
        var arr = [];
        $div.find('.moreellipses').remove();
        $div.find('.morelink').remove();
        var title = $div.find('h2').html();
        $div.find('h2').remove();
        var content = $div.text();
        arr.push(title);
        arr.push(content.replace(/^\s*[\r\n]/gm, ""));
        arr.push("NOTE")
        //console.log(JSON.stringify(arr));
        window.HtmlViewer.getContentEditFavorite(JSON.stringify(arr));
    }
}

function removeFavorite() {
    $('input:checked').parent().remove();
}

function refreshFavorite() {
    location.hash = "#reload";
    location.reload();
}
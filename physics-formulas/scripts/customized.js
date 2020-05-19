var customized = {
    fullMode: false,
    limit: 3,
    variables: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],

    loadUI: {
        title: function (title) {
            $('.title').append(' <div class="well well-sm">' +
                '<h1>' + title + '</h1>' +
                '</div>');
        },
        calcButton: function () {
            $('.calc-button').html('<button type="button" class="btn btn-primary btn-lg btn-block calc">' + customized.localize.language.calculate + '</button>');
        },
        addMoreVarButton: function () {
            $('.add-variable').html('<button type="button" class="btn btn-success btn-block btn-lg btn-customized" id="add-variable">' + customized.localize.language.add_more_variable + '</button>');
        },
        addMoreResultButton: function () {
            $('.add-result').html('<button type="button" class="btn btn-warning btn-block btn-lg btn-customized" id="add-result">' + customized.localize.language.add_more_result + '</button>');
        },
        editTitle: function (title) {
            $('.title').append('<div class="form-group text-center well well-sm">' +
                '<label>' + customized.localize.language.title_of_new_tool + '</label>' +
                '<input type="text" class="form-control text-center" value="' + title + '">' +
                '</div>');
        },
        variable: function (label, varialbe, value) {
            if (!value) value = 1;
            $('.variables').append('<div class="form-group">' +
                '<label for="' + varialbe + '">' + label + ' (' + varialbe + '):</label>' +
                '<input type="tel" id="' + varialbe + '" class="clearable form-control" value="' + value + '" />' +
                '</div>');
        },
        result: function (label, formula) {
            if (!formula) formula = 1;
            formula = formula.toLowerCase();
            $('.results').append(' <p class="bg-info result">' +
                '<label>' + label + ' <code><i>' + formula + '</i></code> = </label>\n' +
                '<span data-formula="' + formula + '"></span>' +
                '</p>');

        },

        addVariable: function (variable, name) {

            var index = $('.variables .variable').length;
            if (!customized.fullMode && index >= customized.limit) {
                //alert('Free version is limited with only 3 variables. For more, please use Full version.');
                window.HtmlViewer.alertFullVersion();
                return;
            } else if (index >= customized.variables.length) {
                return;
            }
            if (!variable)
                variable = customized.variables[index];
            if (!name) name = '';
            var title = customized.localize.language.name_of_variance + ' ' + variable;
            $('.variables').append('<div class="form-group variable">' +
                '<label for="' + variable + '">' + title + ':</label>' +
                '<input type="text" id="' + variable + '" class="form-control" value="' + name + '">' +
                '</div>');
        },

        addResult: function (formula, name) {
            if (!formula) formula = '';
            if (!name) name = '';
            var index = $('.results .result').length;
            if (!customized.fullMode && index >= customized.limit) {
                //alert('Free version is limited with only 3 variables. For more, please use Full version');
                window.HtmlViewer.alertFullVersion();
                return;
            }

            $('.results').append('<div class="result">' +
                '<div class="form-group formula">' +
                '<label>' + customized.localize.language.formula_for_the_tool + ' ' + (index + 1) + ':</label>' +
                '<input type="text" id="formula1" class="form-control" value="' + formula + '">' +
                '</div>' +
                '<div class="form-group name">' +
                '<label>' + customized.localize.language.name_of_result_label + ' ' + (index + 1) + ':</label>' +
                '<input type="text" class="form-control" value="' + name + '">' +
                '</div>' +
                '</div>');
        }
    },

    reformat: function (value) {
        value = value.replace(/[^0-9\.\,\-]/g, '');
        value = conversion.reformat(value);
        return value;
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

            if (obj.keyCode !== 189) {
                var value = this.value;
                value = value.replace(/[^0-9\.\,\-]/g, '');
                value = conversion.reformat(value);
                $(this).val(value);
                //if (!isNaN(value) && value !== "" && !conversion.bypass(value)) {
                //    value = conversion.reformat(value);
                //    $(this).val(conversion.format(value));
                //} else {
                //    $(this).val();
                //}
            }
        },
        calc: function (obj, e) {
            $('.results [data-formula]').each(function () {
                var formula = $(this).attr('data-formula').toLowerCase();
                // replace formula
                formula = formula.replaceAll(String.fromCharCode(215), '*');
                formula = formula.replaceAll(String.fromCharCode(247), '/');

                $('.variables input').each(function (key, val) {
                    var value = customized.reformat($(this).val());
                    formula = formula.replaceAll($(this).attr('id'), value);
                });

                //formula = customized.replacePow(formula);
                var value = math.eval(formula);
                $(this).html(conversion.format(value));
            });
        },
        addVariable: function () {
            customized.loadUI.addVariable();
        },
        addResult: function () {
            customized.loadUI.addResult();
        }
    },

    resolvePow: function (str) {
        var reg = new RegExp(/(.+)\^(.+)/g);

        return str.replace(reg, 'Math.pow($1,$2)');
    },
    replacePow: function (str) {
        var arr = str.split(/[\+,\-,\*,\/]/g);
        if (arr && arr.length > 0) {
            $.each(arr, function (key, val) {
                if (val.indexOf('^') > 0) {
                    var resolve = customized.resolvePow(val);
                    str = str.replaceAll(val, resolve);
                }
            });
        }
        return str;

    },

    saveFormula: function () {
        var formula = {
            title: $('.title input').val(),
            variables: [],
            result: []
        };
        $('.variables .variable').each(function (key, val) {
            var $input = $(this).find('input');
            if ($input.val().length > 0) {
                formula.variables.push({
                    name: $input.val(),
                    variable: $input.attr('id')
                });
            }

        });

        $('.results .result').each(function (key, val) {
            if ($(this).find('.formula input').val().length > 0) {
                formula.result.push({
                    formula: $(this).find('.formula input').val(),
                    name: $(this).find('.name input').val()
                });
            }
        });

        //return JSON.stringify(formula);
        var obj = {
            title: formula.title,
            data: JSON.stringify(formula)
        };
        //return JSON.stringify(obj);
        window.HtmlViewer.saveFormula(JSON.stringify(obj));
    },

    loadFormula: function (json) {
        if (json && json.length > 0) {
            var data = JSON.parse(json);
            if (data) {
                customized.loadUI.title(data.title);

                $.each(data.variables, function (key, val) {
                    customized.loadUI.variable(val.name, val.variable);
                });

                $.each(data.result, function (key, val) {
                    customized.loadUI.result(val.name, val.formula);
                });

                customized.initialize();
            }
        }
    },

    editFormula: function (json) {
        customized.localize.init();
        if (json && json.length > 0) {
            var data = JSON.parse(json);
            if (data) {
                customized.loadUI.editTitle(data.title);

                $.each(data.variables, function (key, val) {
                    customized.loadUI.addVariable(val.variable, val.name);
                });

                $.each(data.result, function (key, val) {
                    customized.loadUI.addResult(val.formula, val.name);
                });

                customized.initializeTool();
            }
        } else {
            //customized.fullMode = true;
            customized.loadUI.editTitle('');
            customized.loadUI.addVariable('a');
            customized.loadUI.addResult();
            customized.initializeTool();
        }
    },

    initializeTool: function () {

        customized.loadUI.addMoreVarButton();
        customized.loadUI.addMoreResultButton();
        $('#add-variable').click(customized.handler.addVariable);
        $('#add-result').click(customized.handler.addResult);
    },

    initialize: function () {
        customized.localize.init();
        customized.loadUI.calcButton();
        $('.variables .clearable').clearSearch();
        $('.variables input').keyup(customized.handler.keyup);
        $('.calc').click(customized.handler.calc);

    },

    /* localize customized tool */
    localize: {
        language: null,
        init: function () {
            var localCode = window.location.search.substring(1, location.search.length);
            console.log('localCode: ' + localCode);
            console.log('window.location.search: ' + JSON.stringify(window.location));
            customized.localize.language = $.extend(customized.localize['en'], customized.localize[localCode]);
        },
        en: {
            title_of_new_tool: "Title of new tool",
            name_of_variance: "Name of the variable",
            formula_for_the_tool: "Formula of the tool",
            name_of_result_label: "Name of the result",
            add_more_variable: "Add more variable",
            add_more_result: "Add more result",
            calculate: "Calculate"
        },
        vi: {
            title_of_new_tool: "Tên công cụ",
            name_of_variance: "Tên biến số",
            formula_for_the_tool: "Công thức của phép tính",
            name_of_result_label: "Tên của kết quả",
            add_more_variable: "Thêm biến số",
            add_more_result: "Thêm kết quả",
            calculate: "Tính"
        },

        zh: {

            title_of_new_tool: "新工具标题",
            name_of_variance: "变量的名称",
            add_more_variable: "添加变量",
            formula_for_the_tool: "工具的公式",
            name_of_result_label: "结果的名称",
            add_more_result: "加入结果",
            calculate: "计算"
        },

        fr: {

            title_of_new_tool: "Titre du nouvel outil",
            name_of_variance: "Nom de la variable",
            add_more_variable: "Ajouter une variable",
            formula_for_the_tool: "Formule de l'outil",
            name_of_result_label: "Nom du résultat",
            add_more_result: "Ajouter la suite",
            calculate: "Calculer"
        },

        ja: {
            title_of_new_tool: "新しいツールのタイトル",
            name_of_variance: "変数の名前",
            add_more_variable: "変数を追加します。",
            formula_for_the_tool: "ツールの式",
            name_of_result_label: "結果の名前",
            add_more_result: "結果を追加",

            calculate: "計算"
        },

        es: {
            title_of_new_tool: "Título de la nueva herramienta",
            name_of_variance: "Nombre de la variable",
            add_more_variable: "Añadir variables",
            formula_for_the_tool: "Fórmula de la herramienta",
            name_of_result_label: "Nombre del resultado",
            add_more_result: "Añadir resultado",

            calculate: "Calcular"
        },

        de: {
            title_of_new_tool: "Titel des neuen Werkzeugs",
            name_of_variance: "Name der Variablen",
            add_more_variable: "Variable hinzufügen",
            formula_for_the_tool: "Formel des Werkzeugs",
            name_of_result_label: "Nennen Sie das Ergebnis",
            add_more_result: "Folge hinzufügen",

            calculate: "Berechnen"
        },

        ko: {
            title_of_new_tool: "새로운 도구의 제목",
            name_of_variance: "변수의 이름",
            add_more_variable: "변수를 추가",
            formula_for_the_tool: "공구의 화학식",
            name_of_result_label: "결과의 이름",
            add_more_result: "결과 추가",

            calculate: "계산"
        },
        ru: {
            title_of_new_tool: "Название нового инструмента",
            name_of_variance: "Имя переменной",
            add_more_variable: "Добавить переменную",
            formula_for_the_tool: "Формула инструмента",
            name_of_result_label: "Название результате",
            add_more_result: "Добавить результат",

            calculate: "Подсчитать"
        },

        pt: {
            title_of_new_tool: "Título da nova ferramenta",
            name_of_variance: "Nome da variável",
            add_more_variable: "Adicionar variável",
            formula_for_the_tool: "Fórmula da ferramenta",
            name_of_result_label: "Nome do resultado",
            add_more_result: "Adicionar resultado",

            calculate: "Calcular"
        },

        "zh-rTW": {
            title_of_new_tool: "新工具標題",
            name_of_variance: "變量的名稱",
            add_more_variable: "添加變量",
            formula_for_the_tool: "工具的公式",
            name_of_result_label: "結果的名稱",
            add_more_result: "加入結果",

            calculate: "計算"
        },

        it: {
            title_of_new_tool: "Titolo del nuovo strumento",
            name_of_variance: "Nome della variabile",
            add_more_variable: "Aggiungi variabili",
            formula_for_the_tool: "Formula dell'utensile",
            name_of_result_label: "Nome del risultato",
            add_more_result: "Aggiungere risultato",

            calculate: "Calcola"
        },

        "el": {
            title_of_new_tool: "Τίτλος του νέου εργαλείου",
            name_of_variance: "Όνομα της μεταβλητής",
            add_more_variable: "Προσθέστε μεταβλητή",
            formula_for_the_tool: "Τύπος του εργαλείου",
            name_of_result_label: "Όνομα του αποτελέσματος",
            add_more_result: "Προσθέστε αποτέλεσμα",

            calculate: "Υπολόγισε"
        },

        th: {
            title_of_new_tool: "ชื่อของเครื่องมือใหม่",
            name_of_variance: "ชื่อของตัวแปร",
            add_more_variable: "เพิ่มตัวแปร",
            formula_for_the_tool: "สูตรของเครื่องมือ",
            name_of_result_label: "ชื่อของผล",
            add_more_result: "เพิ่มผล",

            calculate: "คำนวณ"
        },

        id: {
            title_of_new_tool: "Judul alat baru",
            name_of_variance: "Nama variabel",
            add_more_variable: "Tambahkan variabel",
            formula_for_the_tool: "Formula alat",
            name_of_result_label: "Nama hasilnya",
            add_more_result: "Tambahkan hasil",

            calculate: "Menghitung"
        },

        ms: {
            title_of_new_tool: "Tajuk alat baru",
            name_of_variance: "Nama pembolehubah",
            add_more_variable: "Tambah pembolehubah",
            formula_for_the_tool: "Formula alat",
            name_of_result_label: "Nama keputusan",
            add_more_result: "Tambah hasil",

            calculate: "Mengira"
        },

        hi: {
            title_of_new_tool: "नए उपकरण का शीर्षक",
            name_of_variance: "चर का नाम",
            add_more_variable: "चर जोड़ें",
            formula_for_the_tool: "उपकरण का फॉर्मूला",
            name_of_result_label: "परिणाम का नाम",
            add_more_result: "परिणाम जोड़ें",

            calculate: "गणना"
        },

        bn: {
            title_of_new_tool: "নতুন টুল শিরোনাম",
            name_of_variance: "পরিবর্তনশীল এর নাম",
            add_more_variable: "পরিবর্তনশীল যোগ করুন",
            formula_for_the_tool: "হাতিয়ার সূত্র",
            name_of_result_label: "ফলাফল নাম",
            add_more_result: "ফলাফল যোগ করুন",

            calculate: "হিসাব"
        },

        ar: {
            title_of_new_tool: "عنوان أداة جديدة",
            name_of_variance: "اسم المتغير",
            add_more_variable: "إضافة متغير",
            formula_for_the_tool: "صيغة الأداة",
            name_of_result_label: "اسم نتيجة",
            add_more_result: "إضافة نتيجة",

            calculate: "الحساب"
        },

        tr: {
            title_of_new_tool: "Yeni araç Başlığı",
            name_of_variance: "Değişken Adı",
            add_more_variable: "Değişken ekle",
            formula_for_the_tool: "Aracın formülü",
            name_of_result_label: "Sonuç Adı",
            add_more_result: "Sonucu ekle",

            calculate: "Hesaplamak"
        },

        nl: {
            title_of_new_tool: "Titel van de nieuwe tool",
            name_of_variance: "Naam van de variabele",
            add_more_variable: "Variabele toe te voegen",
            formula_for_the_tool: "Formule van het gereedschap",
            name_of_result_label: "Naam van het resultaat",
            add_more_result: "Resultaat toe te voegen",

            calculate: "Berekenen"
        },

        pl: {
            title_of_new_tool: "Tytuł nowego narzędzia",
            name_of_variance: "Nazwa zmiennej",
            add_more_variable: "Dodaj zmienną",
            formula_for_the_tool: "Wzór narzędzia",
            name_of_result_label: "Imię wyniku",
            add_more_result: "Dodaj wyniki",

            calculate: "Oblicz"
        },
        ro: {
            title_of_new_tool: "Titlul nou instrument",
            name_of_variance: "Numele variabilei",
            add_more_variable: "Adăugați variabilă",
            formula_for_the_tool: "Formula a sculei",
            name_of_result_label: "Nume rezultatului",
            add_more_result: "Adăugați rezultat",

            calculate: "Calculează"
        },

        fa: {
            title_of_new_tool: "عنوان ابزار جدید",
            name_of_variance: "نام متغیر",
            add_more_variable: "اضافه کردن متغیر",
            formula_for_the_tool: "فرمول از ابزار",
            name_of_result_label: "نام و نام خانوادگی از نتیجه",
            add_more_result: "اضافه کردن نتیجه",

            calculate: "محاسبه"
        },

        az: {
            title_of_new_tool: "Yeni alət adı",
            name_of_variance: "Dəyişən adı",
            add_more_variable: "Dəyişən əlavə et",
            formula_for_the_tool: "Alət Formula",
            name_of_result_label: "Nəticədə adı",
            add_more_result: "Nəticəsində əlavə et",

            calculate: "Hesablayın "
        },

sv: {
title_of_new_tool: 'Namn på nya verktyget',
name_of_variance: 'Namn på variabeln',
add_more_variable: 'Lägg till fler variabler',
formula_for_the_tool: 'Verktygsformeln',
name_of_result_label: 'Namn på resultatet',
add_more_result: 'Lägg till fler resultat',
calculate: 'Beräkna',
},

hu: {
title_of_new_tool: 'Új eszköz neve',
name_of_variance: 'Változó neve',
add_more_variable: 'Változó hozzáadása',
formula_for_the_tool: 'Eszköz képlete',
name_of_result_label: 'Az eredmény neve',
add_more_result: 'További eredmények hozzáadása',
calculate: 'Számol',
},


        uk: {
            title_of_new_tool: "Назва нового інструменту",
            name_of_variance: "Ім'я змінної",
            add_more_variable: "Додати змінну",
            formula_for_the_tool: "Формула інструменту",
            name_of_result_label: "Назва результаті",
            add_more_result: "Додати результат",

            calculate: "Розрахувати "
        }
    }
};

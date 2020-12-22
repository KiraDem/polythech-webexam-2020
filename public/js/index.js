import {getData, getPlaceData} from './connect.js';

//----------

const getListData = () => {
    getData().then(data => {

        let filterOptions = () =>{
            let getOkrug =  data.map(okrug => okrug.admArea);
            let viewOkrug = Array.from(new Set(getOkrug)).filter(okrug => okrug !== null).map(okrug => ' <option value="'+ okrug+'">' + okrug + '</option>');
            let getDistrict =  data.map(district => district.district);
            let district = Array.from(new Set(getDistrict)).filter(distr => distr !== null).map(distr => ' <option value="'+ distr+'">' + distr + '</option>');

            let getType =  data.map(type => type.typeObject);
            let typeObject =  Array.from(new Set(getType)).filter(type => type !== null ).map(type => ' <option value="'+ type+'">' + type + '</option>');

            let getPrivileges =  data.map(type => type.socialPrivileges);
            let socialPrivileges =  Array.from(new Set(getPrivileges)).filter(soc => soc !== null ).map(social => ' <option value="'+social+'">' + social + '</option>');

            document.getElementById('okrug').innerHTML = '<option value="default"></option>' + viewOkrug;
            document.getElementById('rayon').innerHTML = '<option value="default"></option>' + district;
            document.getElementById('type').innerHTML = '<option value="default"></option>' + typeObject;
            document.getElementById('sale').innerHTML = '<option value="default"></option>' + socialPrivileges;
        };


        let getApi = () => {

            let pagination = document.getElementById('pagination')
            let notesOnPage = 20;
            let countOfItems = Math.ceil(data.length / notesOnPage);

            let showPage = (function() {
                let active;

                return function(item) {
                    if (active) {
                        active.classList.remove('active');
                    }
                    active = item;

                    item.classList.add('active');

                    let pageNum = +item.innerHTML;

                    let start = (pageNum - 1) * notesOnPage;
                    let end = start + notesOnPage;

                    // console.log(pageNum, notesOnPage , start)

                    let notes = data.slice(start, end);


                    document.getElementById('listCompany').innerHTML = '';

                    let creates = notes.map(place => `<tr><td>${place.name}</td><td>${place.typeObject}</td><td>${place.address}</td><td><div class="btn btn-primary thisBtnList"  id="${place.id}">Выбрать</div></td></tr>`).join('');
                            document.getElementById('listCompany').innerHTML = creates;
                        $('.thisBtnList').click(function () {
                            let ids =  $(this).attr('id');
                            checkPlace(ids)
                        })
                };
            }());
            let items = [];
            for (let i = 1; i <= countOfItems ; i++) {
                let li = document.createElement('li');
                li.innerHTML = i;
                pagination.appendChild(li);
                items.push(li);
            }

            showPage(items[0]);

            for (let item of items) {
                item.addEventListener('click', function() {
                    showPage(this);
                });
            }
        };

        filterOptions();
        getApi();
    })

};

//----------

let getFilterParam = () => {

    let valOne = document.getElementById('okrug').value;

    let valTwo = document.getElementById('rayon').value;
    let valThree = document.getElementById('type').value;
    let valFour = document.getElementById('sale').value;
    getData().then(data => {
        let resultFilter =  data.filter(place => (valOne !== 'default') ? place.admArea === valOne : place.admArea !== valOne
            && (valTwo !== 'default') ? place.district === valTwo : place.district !== valTwo
            && (valThree !== 'default') ? place.typeObject === valThree : place.typeObject !== valThree
            && (valFour !== 'default') ? place.socialPrivileges === Number(valFour) : place.socialPrivileges !== Number(valFour)
        )
            .map(place => `<tr><td>${place.name}</td><td>${place.typeObject}</td><td>${place.address}</td><td><div class="btn btn-primary thisBtnList" id="${place.id}">Выбрать</div></td></tr>`).join('');

        document.getElementById('listCompany').innerHTML = resultFilter;

        $('.thisBtnList').click(function () {
            let ids =  $(this).attr('id');
            checkPlace(ids)
        })
        // return data
    })
};


//----------

function checkPlace(ids) {
    document.getElementById('finalPrice').innerText = 0;
    document.getElementById('finalCostOut').innerText = 0;

    let response = fetch('http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1/'+ids);
    response.then((response) => {
        return response.json();
    }).then((data) => {
        let listsSetView = [data.set_1, data.set_2, data.set_3, data.set_4, data.set_5, data.set_6, data.set_7, data.set_8,
            data.set_9].map(set => '' +
            '                        <div class="card mb-4 shadow-sm">\n' +
            '                            <div class="card-header">\n' +
            '                                <img src="public/img/product.jpg">\n' +
            '                            </div>\n' +
            '                            <div class="card-body">\n' +
            '                                <h1 class="card-title pricing-card-title text-center"><span id="'+set+'_price">'+ set +'</span> <small>руб.</small></h1>\n' +
            '                                <ul class="list-unstyled mt-3 mb-4 text-center">\n' +
            '                                    <li>Name'+ set +'</li>\n' +
            '                                    <li>Description'+ set +'</li>\n' +
            '                                    <li class="pt-3">\n' +
            '                                        <div class="count_box"  id="'+set+'">\n' +
            '                                            <div class="minus">-</div>\n' +
            '                                                <input class="inp_price" id="id_'+ set +'" type="text" value="0">\n' +
            '                                            <div class="plus">+</div>\n' +
            '                                        </div>\n' +
            '                                    </li>\n' +
            '                                </ul>\n' +
            '\n' +
            '\n' +
            '                            </div>\n' +
            '\n' +
            '                        </div>\n').join('');
        let placeView = document.getElementById('sets_place');
        placeView.innerHTML = listsSetView;




        let finalList = [];
        let popupContainerSets = document.getElementById('listOrderFinal')

        const buttonsPlus = document.querySelectorAll(".plus")
        for (const button of buttonsPlus) {
            button.addEventListener('click', function(event) {
                let getFinalPrice = Number(document.getElementById('finalPrice').innerText);

                let getIdSet = event.target.parentNode.id;
                finalList.push(getIdSet);
                console.log(finalList)
                let inputCountSet =  document.getElementById('id_'+getIdSet)
                let countValue = inputCountSet.value++;
                inputCountSet.countValue = countValue;
                let numTwo = Number(getFinalPrice) + Number(getIdSet);
                document.getElementById('finalPrice').innerHTML = numTwo;

            })
        }



        const buttonsMinus = document.querySelectorAll(".minus")
        for (const button of buttonsMinus) {
            button.addEventListener('click', function(event) {
                let getFinalPrice = Number(document.getElementById('finalPrice').innerText);
                let getIdSet = event.target.parentNode.id;
                let inputCountSet =  document.getElementById('id_'+getIdSet)


                if (inputCountSet.value > 0) {
                    let countValue = inputCountSet.value--;
                    inputCountSet.countValue = countValue;


                    let numOne = (Number(getFinalPrice - getIdSet));
                    document.getElementById('finalPrice').innerHTML = numOne;


                    let index = finalList.indexOf(getIdSet);
                    if (index > -1) {
                        finalList.splice(index, 1);
                    }
                    console.log(finalList);
                }




            })
        }

        const actionPopup = document.getElementById('finalCheck')

        document.addEventListener('click', function (event) {
            if(event.target.id === 'showPopup'){
                let content = '';
                const sorList = finalList.reduce((acum,cur) => Object.assign(acum,{[cur]: (acum[cur] | 0)+1}),{});



                for (let item in sorList){
                    let partyCheck = document.getElementById('partyCheck')

                    if(partyCheck.checked) {
                        content += '<div class="row align-items-center mt-2 mb-2">\n' +
                            '                                                <div class="col-3">\n' +
                            '                                                    <img src="public/img/product.jpg">\n' +
                            '                                                </div>\n' +
                            '                                                <div class="col-5">\n' +
                            '                                                    <h6>Name prodd ' + item + '</h6>\n' +
                            '                                                </div>\n' +
                            '                                                <div class="col-2 text-center">\n' +
                            '                                                    <p><span id="count">' + Number(sorList[item])*Number(5) + '</span>*<span>' + item + '</span>руб</p>\n' +
                            '                                                </div>\n' +
                            '                                                <div class="col-2 text-right">\n' +
                            '                                                    <p><span id="price">' + Number(5) * Number(item) * Number(sorList[item]) + '</span>руб</p>\n' +
                            '                                                </div>\n' +
                            '                                            </div>\n';
                    }else {
                        content += '<div class="row align-items-center mt-2 mb-2">\n' +
                            '                                                <div class="col-3">\n' +
                            '                                                    <img src="public/img/product.jpg">\n' +
                            '                                                </div>\n' +
                            '                                                <div class="col-5">\n' +
                            '                                                    <h6>Name prodd ' + item + '</h6>\n' +
                            '                                                </div>\n' +
                            '                                                <div class="col-2 text-center">\n' +
                            '                                                    <p><span id="count">' + sorList[item] + '</span>*<span>' + item + '</span>руб</p>\n' +
                            '                                                </div>\n' +
                            '                                                <div class="col-2 text-right">\n' +
                            '                                                    <p><span id="price">' + Number(item) * Number(sorList[item]) + '</span>руб</p>\n' +
                            '                                                </div>\n' +
                            '                                            </div>\n';
                    }
                }
                popupContainerSets.innerHTML = content;

                let getFinalPrice = document.getElementById('finalPrice').innerText;
                console.log(getFinalPrice)
                let partyCheck = document.getElementById('partyCheck')
                let onlyHotCheck = document.getElementById('onlyHotCheck')
                let optionOne = document.getElementById('optionOne');
                let optionTwo = document.getElementById('optionTwo');



                console.log(data)
                let orderInfo = '<h6 class="pt-3 pb-3">Информация о предприятии:</h6>\n' +
                    '                                            <div class="row">\n' +
                    '                                                <div class="col-6">\n' +
                    '                                                    <p><b>Название</b></p>\n' +
                    '                                                </div>\n' +
                    '                                                <div class="col-6 text-right">\n' +
                    '                                                    <p id="getNamePrice"><b>'+ data.name +'</b></p>\n' +
                    '                                                </div>\n' +
                    '                                            </div>\n' +
                    '                                            <div class="row">\n' +
                    '                                                <div class="col-6">\n' +
                    '                                                    <p><b>Административный округ</b></p>\n' +
                    '                                                </div>\n' +
                    '                                                <div class="col-6 text-right"><b>'+ data.admArea +'</b></div>\n' +
                    '                                            </div>\n' +
                    '                                            <div class="row">\n' +
                    '                                                <div class="col-6">\n' +
                    '                                                    <p><b>Район</b></p>\n' +
                    '                                                </div>\n' +
                    '                                                <div class="col-6 text-right"><p><b>'+ data.district +'</b></p></div>\n' +
                    '                                            </div>\n' +
                    '                                            <div class="row">\n' +
                    '                                                <div class="col-6">\n' +
                    '                                                    <p><b>Адрес</b></p>\n' +
                    '                                                </div>\n' +
                    '                                                <div class="col-6 text-right"><p><b>'+ data.address +'</b></p></div>\n' +
                    '                                            </div>\n';

                document.getElementById('orderInfo').innerHTML = orderInfo;

                let finalCostOut = document.getElementById('finalCostOut');
                let costDelivery = document.getElementById('costDelivery').innerText;

                if(partyCheck.checked){


                    finalCostOut.innerText = (Number(getFinalPrice))*2.5 + Number(costDelivery)
                    optionOne.innerHTML ='' + '<div class="col-6">' + '<p><b>На компанию</b></p>\n' + '</div>' +
                        '<div class="col-6 text-right"><span>Скидка 50% на X5 заказ = ' + Math.ceil(Number((getFinalPrice)*2.5))  +'</span> руб. Теперь все позиции в заказе стоят в 2 раза дешевле!</div>'

                }
                else {
                    finalCostOut.innerText = Number(getFinalPrice) + Number(costDelivery)
                    optionOne.innerHTML =''
                }


                if(onlyHotCheck.checked){
                    if(partyCheck.checked){
                        optionTwo.innerHTML ='' +
                            '<div class="col-6">' +
                            '     <p><b>Только горячим</b></p>' +
                            '      </div>' +
                            '         <div class="col-6 text-right mt-2"><span>Если блюдо приедет холодным, Ваш заказ будет стоить '+Math.ceil(Number(getFinalPrice*2.5   -  getFinalPrice*2.5*0.3 ))  +'</span> руб. без учёта стоимости доставки.</div>'
                    }
                    else {
                        optionTwo.innerHTML ='' +
                            '<div class="col-6">' +
                            '     <p><b>Только горячим</b></p>' +
                            '      </div>' +
                            '         <div class="col-6 text-right mt-2"><span>Если блюдо приедет холодным, Ваш заказ будет стоить '+Math.ceil(Number(getFinalPrice - getFinalPrice*0.3 ))  +'</span> руб. без учёта стоимости доставки.</div>'
                    }
                }
                else {
                    optionTwo.innerHTML = ''
                }
            }
        });
        return data
    })
}

//----------


document.getElementById('search').onclick = function(){
    getFilterParam();
};



getListData();

$('#sendOrder').click(function () {
    sendOrder();
});

let sendOrder = () => {

    let inputOne = document.getElementById('fio').value;
    let inputTwo = document.getElementById('textArea').value;
    if(inputOne == '' || inputTwo == ''){
        document.getElementById('errorAlert').innerText = 'Пожалуйста укажите адрес доставки и ваше имя!';
        document.getElementById('errorAlert').style.display = 'block';
    }
    else {
        let getNamePrice = document.getElementById('getNamePrice').innerText;
        let finalCostOut = document.getElementById('finalCostOut').innerText;
        let textAlerts ='Заказ в '+ getNamePrice +', на сумму '+ finalCostOut + ' рублей успешно оформлен! Начинаем готовить, ожидайте звонка от курьера!';
        document.getElementById('successAlert').innerText = textAlerts;
        document.getElementById('successAlert').style.display = 'block';
        document.getElementById('listOrderFinal').innerText='';
        document.getElementById('orderInfo').innerText='';
        document.getElementById('finalCostOut').innerText='';
        document.getElementById('errorAlert').style.display = 'none';
        $('#finalCheck').fadeOut('slow');
    }

};





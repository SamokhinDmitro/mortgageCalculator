/*Ипотечный калькулятор*/
document.addEventListener('DOMContentLoaded', () => {

    /*Инпуты*/
    //стоимость недвижимости
    const totalCost = document.querySelector('#total-cost'),
          //первоначальный взнос
          anInitialFree = document.querySelector('#an-initial-fee'),
          //срок кредита
          creditTerm = document.querySelector('#credit-term');


    /*Ползунки*/
    //стоимость недвижимости-range
    const totalCostRange = document.querySelector('#total-cost-range'),
          //первоначальный взнос-range
          anInitialFreeRange = document.querySelector('#an-initial-fee-range'),
          //срок кредита-range
          creditTermRange = document.querySelector('#credit-term-range');

    /*Результат работы*/
    const totalLounAmount = document.querySelector('#amount-of-credit'),
          totalMonthlyPayment = document.querySelector('#monthly-payment'),
          totalIncome = document.querySelector('#recommended-income');


    const allRange = document.querySelectorAll('.input-range');
    const allInputs = document.querySelectorAll('.input-start');
    const banksWrap = document.querySelector('.calculator-content-body-left-btns');

    // Информация о банках
    const banks = [
        {name: 'ochadbank', descr: 'Ощадбанк', percent: 9.24},
        {name: 'privatbank', descr: 'ПриватБанк', percent: 8.97},
        {name: 'radabank', descr: 'РадаБанк', percent: 13.85},
        {name: 'mtb', descr: 'МТБ Банк', percent: 11.56},
        {name: 'urggaz', descr: 'УкрГазБанк', percent: 8.47},
        {name: 'kredo', descr: 'Kredo Bank', percent: 8.68}
    ];


    //Обработка ползунков
    allRange.forEach(elem => {
        elem.addEventListener('input', initRange);
    });

    //Обработка ввода данных в инпуты
    allInputs.forEach((elem, index) => {
        if(index === 0) {
            elem.addEventListener('focus', clearInputs);
            elem.addEventListener('blur',  checkEmpty);
            elem.addEventListener('change', initInputs);
        }else{
            elem.disabled = true;
        }
    });

    //Вывод процентных ставок банков
    for(let bank of banks) {
        createBankBtn(bank.name, bank.descr, bank.percent);
    }


    //Начальная процентная ставка
    let currentPercent = getCurrentPercent(0);


    let bankBtns = document.querySelectorAll('.bank');

    //Выбор процентных ставок банков
    bankBtns.forEach(elem => {

       elem.addEventListener('click', () => {

           for(let item of bankBtns) {
               item.classList.remove('active');
           }

           elem.classList.add('active');

           takeActiveBank(elem);
       }) ;
    });

    //Обработка ползунков
    function initRange() {
        totalCostRange.min = 134000;
        totalCost.value = totalCostRange.value;
        calcStartValue();

        //ипотечный калькулятор
        calculation(Number(totalCost.value), Number(anInitialFree.value), Number(creditTerm.value));
    }

    //вычисление начальных параметров калькулятора
    function calcStartValue() {
        /*
        Минимальный размер первого взноса 25% от суммы недвижимости
        Максимальный размер первого взноса не более 70% от суммы недвижимости
         */

        anInitialFreeRange.min = Math.round((Number(totalCost.value) / 100) * 25);
        anInitialFreeRange.max = Math.round((Number(totalCost.value) / 100) * 70);

        anInitialFree.value = anInitialFreeRange.min;
        anInitialFree.value = anInitialFreeRange.value;

        creditTerm.value = creditTermRange.min;
        creditTerm.value = creditTermRange.value;
    }

    //Обработка ввода данных от пользователя
    function initInputs() {
        totalCostRange.min = 134000;
        totalCostRange.value = totalCost.value;
        calcStartValue();

        //ипотечный калькулятор
        calculation(Number(totalCost.value), Number(anInitialFree.value), Number(creditTerm.value));
    }


    //Проверка на пустоту inputs
    function checkEmpty () {
        if(this.value.length === 0) {
            this.value = '0';
        }
    }

    function clearInputs() {
        this.value = '';
    }


    //Создание кнопок банка
    function createBankBtn (attr,text, percent) {
        let bankBtn = document.createElement('button');
        bankBtn.classList.add('bank');
        bankBtn.dataset.name = attr;

        let descrBank = document.createElement('div');
        descrBank.classList.add('text');
        descrBank.innerText = text;

        let percentBank = document.createElement('div');
        percentBank.classList.add('value');
        percentBank.innerText = `${percent}%`;

        banksWrap.append(bankBtn);
        bankBtn.append(descrBank);
        bankBtn.append(percentBank);
    }


    //Получем процент у активного банка
    function takeActiveBank(currentActive) {
        let dataAttrValue = currentActive.dataset.name;
        let currentBank = banks.find(bank => bank.name === dataAttrValue);
        currentPercent = currentBank.percent;

        calculation(Number(totalCost.value), Number(anInitialFree.value), Number(creditTerm.value));

    }

    //Начальный процент ставки
    function getCurrentPercent(index) {
        let test = document.querySelectorAll('.bank')[index];
        test.classList.add('active');

        let percent = banks[index].percent;
        return percent;
    }

    //Логика ипотечного калькулятора
    const calculation = (totalCost = 0, anInitialFee = 5000, creditTerm = 1) => {

        /*
        ЕП - ежемесячный платеж
        РК - размер кредита
        ПС - процентная ставка
        КМ - количество месяцев

        ЕП = (РК + (((РК / 100) * ПС) / 12) * КМ) / КМ
         */

        let monthlyPayment; // ежемесячный платеж
        let lounAmount = totalCost - anInitialFee; // размер кредита
        let interestRate = currentPercent; //процентная ставка
        let numberOfYears = creditTerm;// количество лет
        let numberOfMonth = 12 * numberOfYears;// количество месяцев

        monthlyPayment = (lounAmount + (((lounAmount / 100) * interestRate) / 12) * numberOfMonth) / numberOfMonth;
        let monthlyPaymentArounded = Math.round(monthlyPayment);

        /*Вывод результатов*/

        if(monthlyPaymentArounded  < 0) {
            return false;
        }else{
            totalLounAmount.innerHTML = `${lounAmount} <span>грн</span>`;
            totalMonthlyPayment.innerHTML = `${monthlyPaymentArounded} <span>грн</span>`;
            totalIncome.innerHTML = `${monthlyPaymentArounded  + Math.round((monthlyPaymentArounded / 100) * 35)} <span>грн</span>`;
        }


    }

});

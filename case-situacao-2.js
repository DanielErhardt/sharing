// Recebe uma data e retorna outra na próxima segunda-feira.
const getNextMonday = (date) => {
  // Essa nova variável é necessária porque Date é uma classe, seu valor é uma referência.
  // Fazer setDate no "date" altera o valor do que foi passado como parâmetro ao chamar a função.
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() + (newDate.getDay() === 0 ? 1 : 2)))
};

// Recebe uma data e retorna outra na sexta-feira anterior.
const getPreviousFriday = (date) => {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() - (newDate.getDay() === 0 ? 2 : 1)))
};

// Recebe uma data e retorna outra no último dia do mês anterior.
const getPreviousMonthOnLastDay = (date) => {
  const newDate = new Date(date);
  return new Date(newDate.setDate(0));
}

// Verifica se é fim de semana.
const isWeekend = (date) => date.getDay() % 6 === 0;

// Normaliza o mês quando as parcelas caem nos anos subsequentes.
const normalizeMonth = (month) => month % 12;

// Cria string formatada de maneira específica para a data.
const getFormattedDate = (date) => date.toLocaleString("pt-BR", {day: "numeric", month: "numeric", year:"numeric"});

// Recebe a data da compra e o número de parcelas
// Retorna uma lista com as datas dos próximos pagamentos, atendendo as condições do sistema.
const generatePaymentDates = (purchaseDate, amount) => {
  console.log('-------------------------------');
  console.log(`Data da compra: ${getFormattedDate(purchaseDate)}.`);
  console.log(`Parcelas: ${amount}`);

  const dates = [];

  for (let i = 1; i <= amount; i += 1) {
    const targetMonth = purchaseDate.getMonth() + i;
    let nextDate = new Date(purchaseDate.getFullYear(), targetMonth, purchaseDate.getDate());

    // Verifica se a nova data pulou mais de um mês.
    const nextDateLeapsAMonth = (targetDate) => {
      return targetDate.getMonth() -  normalizeMonth(targetMonth) !== 0;
    };

    if (nextDateLeapsAMonth(nextDate)) {
      nextDate = getPreviousMonthOnLastDay(nextDate);
      // Verifica se o último dia do mês anterior é um fim de semana.
      // Se sim, adiciona a sexta-feira anterior, caso contrário adiciona a data sem modificar novamente.
      dates.push(isWeekend(nextDate) ? getPreviousFriday(nextDate) : nextDate);
      continue; // Pula para o próximo loop.
    }

    // Caso não tenha pulado um mês, verifica se é fim de semana.
    if (isWeekend(nextDate)) {
      // Pega a data da próxima segunda-feira sem sobrescrever o nextDate.
      const nextMondayDate = getNextMonday(nextDate);

      // Verifica se a próxima segunda-feira pula o mês.
      // Se sim, adiciona a sexta-feira anterior, caso contrário adiciona a próxima segunda-feira.
      dates.push(nextDateLeapsAMonth(nextMondayDate) ? getPreviousFriday(nextDate) : nextMondayDate);
    } else {
      dates.push(nextDate); // Se não for fim de semana, adiciona a data de pagamento.
    }
  }
  return dates;
};

const logDates = (dates) => {
  dates.forEach((date, index) => {
    console.log(`Parcela ${index + 1}: ${getFormattedDate(date)}`);
  });
}

// Alguns testes com as datas mais problemáticas
logDates(generatePaymentDates(new Date(2022,0,29), 18));
logDates(generatePaymentDates(new Date(2022,0,30), 18));
logDates(generatePaymentDates(new Date(2022,0,31), 18));
const fs = require('fs');
const invoices = JSON.parse(fs.readFileSync('invoices.json', 'utf8'));
const plays = JSON.parse(fs.readFileSync('plays.json', 'utf8'));



// 청구서를 생성하는 함수
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명: ${invoice.customer})\n`;

    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);

        // 청구 내역을 출력한다.
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
        totalAmount += amountFor(perf);
    }
    result += `총액: ${usd(totalAmount)}\n`;
    result += `적립 포인트: ${volumeCredits}점\n`;
    return result;


    // 공연 정보를 반환하는 함수
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    // 포인트를 계산하는 함수
    function volumeCreditsFor(aPerformance) {
        let volumeCredits = 0;
        volumeCredits += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type)
            volumeCredits += Math.floor(aPerformance.audience / 5);
        return volumeCredits;
    }

    // 공연 요금을 계산하는 함수
    function amountFor(aPerformance) {
        let result = 0; // 명확한 이름으로 변경

        switch (playFor(aPerformance).type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
        }
        return result;
    }

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber / 100);
    }
}

console.log(statement(invoices[0], plays));

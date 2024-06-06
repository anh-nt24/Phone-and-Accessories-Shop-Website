function getJwtCookie() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('jwt=')) {
            return cookie.substring('jwt='.length);
        }
    }
    return null;
}

function formatMoney(amount) {
    amount = parseFloat(amount);

    if (isNaN(amount)) {
        return 'Invalid amount';
    }

    let moneyString = amount.toLocaleString('en-US');
    return moneyString;
}

// Wait for window to load, return drop down values
window.onload = async () => {    
    let dropdown = document.getElementById('playerSelect');
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Select a player...';

    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

    const data = await getData();
    let option;

    for (let i = 0; i < data.players.length; i++) {
        option = document.createElement('option');
        option.text = `${data.players[i].player.name.first} ${data.players[i].player.name.last}`;
        option.value = data.players[i].player.id;
        dropdown.add(option);
    }
};

// Display different player stats template
playerSelect = async (elem) => {
    let temp = document.getElementById('profileTemplate').content;
    let copyHTML = document.importNode(temp, true);

    if (elem.value === 'Select a player...') {
        // Remove all template elements
        removeElements();
        document.getElementsByClassName('card')[0].style.background = '#fff';
    } else if (document.getElementsByClassName('card')[0].getElementsByTagName('img').length > 0) {
        // Have an exisiting player template, remove then add new player
        removeElements();

        let image = copyHTML.getElementById('playerImg');
        image.src = `./assets/p${elem.value}.png`;
        image.alt = elem.options[elem.options.selectedIndex].text;

        const data = await getData();
        appendPlayer(elem, data, copyHTML);
        document.getElementsByClassName('card')[0].style.background = 'linear-gradient(180deg, #fff 50%, #e66465 50%)';
        document.getElementsByClassName('card')[0].appendChild(copyHTML);      
    } else {
        // Find array instance of player then set their player/stat values
        let image = copyHTML.getElementById('playerImg');
        image.src = `./assets/p${elem.value}.png`;
        image.alt = elem.options[elem.options.selectedIndex].text;

        const data = await getData();
        appendPlayer(elem, data, copyHTML);
        document.getElementsByClassName('card')[0].style.background = 'linear-gradient(180deg, #fff 50%, #e66465 50%)';
        document.getElementsByClassName('card')[0].appendChild(copyHTML);
    }
};

// Fetch call to return player-stats 
getData = () => {
    return new Promise((resolve, reject) => {
        const jsonPath = './data/player-stats.json';
        fetch(jsonPath).then(function(response) {
            if (response.status !== 200) {
                console.warn(`Looks like there was a problem. Status Code: ${response.status}`);
                return;
            }
    
            resolve(response.json());
        }).catch(function(err) {
            console.error(`Fetch Error - ${err}`);
            reject(err);
        });
    });
};

removeElements = () => {
    document.getElementById('playerImg').remove();
    document.getElementById('name').remove();
    document.getElementById('position').remove();
    document.getElementById('appearances').remove();
    document.getElementById('goals').remove();
    document.getElementById('assists').remove();
    document.getElementById('gpm').remove();
    document.getElementById('ppm').remove();
}

appendPlayer = (elem, data, copyHTML) => {
    const i = data.players.map(x => x.player.id).indexOf(Number(elem.value));
    copyHTML.getElementById('name').textContent = `${data.players[i].player.name.first} ${data.players[i].player.name.last}`;
    copyHTML.getElementById('position').textContent = `${data.players[i].player.info.positionInfo}`;
    copyHTML.getElementById('appearances').textContent = `Appearances: ${data.players[i].stats.find(({ name }) => name === 'appearances').value}`;
    copyHTML.getElementById('goals').textContent = `Goals: ${data.players[i].stats.find(({ name }) => name === 'goals').value}`;
    copyHTML.getElementById('assists').textContent = `Assists: ${data.players[i].stats.find(({ name }) => name == 'goal_assist') ? data.players[i].stats.find(({ name }) => name == 'goal_assist').value : 0}`;
    copyHTML.getElementById('gpm').textContent = `Goals per match: ${Number(data.players[i].stats.find(({ name }) => name === 'goals').value / data.players[i].stats.find(({ name }) => name === 'appearances').value).toFixed(2)}`;
    copyHTML.getElementById('ppm').textContent = `Passes per minute: ${Number((data.players[i].stats.find(({ name }) => name === 'fwd_pass').value + data.players[i].stats.find(({ name }) => name === 'backward_pass').value) / data.players[i].stats.find(({ name }) => name === 'mins_played').value).toFixed(2)}`;
}
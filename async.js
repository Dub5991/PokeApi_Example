document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const input = document.querySelector('input');
    const result = document.getElementById('result');
    const button = document.querySelector('button');

    function toTitleCase(str) {
        return str.toLowerCase().split(' ').filter(word => word).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        await searchPokemon();
    });

    button.addEventListener('click', async () => {
        await searchPokemon();
    });

    let alertShown = false;

    /**
     * Asynchronously searches for a Pokémon by name or ID using the PokéAPI.
     * 
     * This function retrieves Pokémon data from the PokéAPI based on the user's input.
     * It handles various scenarios including empty input, request timeout, and invalid responses.
     * If the request is successful, it displays the Pokémon data.
     * 
     * async
     * function searchPokemon
     * returns {Promise<void>} A promise that resolves when the search is complete.
     * throws {Error} Throws an error if the fetch request fails or if invalid data is received.
     */

    const controller = new AbortController();

    async function searchPokemon() {
        const pokemonName = input.value.trim().toLowerCase();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error, status: ${response.status}`);
            }
            const data = await response.json();
            if (!data || !data.name) {
                throw new Error('Invalid Pokémon data received.');
            }
            console.log(data);
            displayPokemon(data);
            alertShown = false; // Reset alertShown if successful
        } catch (error) {
            console.error('Fetch Error:', error.message);
            if (error.name === 'AbortError') {
                alert('Request timed out. Please try again.');
            } else if (!alertShown) {
                alert('Failed to fetch Pokémon data. Please check the Pokémon name or id and try again.');
                alertShown = true;
            }
        }
    }

   

    function displayPokemon(data) { /* This is the function that displays the data */
        result.innerHTML = 
        `<div style="background-image: url('${data.sprites.other['official-artwork'].front_default}'); background-size: cover; background-position: center;">
            <div class="card" style="background: rgba(255, 255, 255, 0.9); max-width: 100%; margin: 20px; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
            <div>
                <img src="${data.sprites.front_default}" alt="${data.name}" style=" background-color: white; border-radius: 50%; width: 150px; height: 150px; padding: 5px; border: solid 2px #ddd;">
            </div>
            <h1 style="margin-top: 10px; font-family: Arial, sans-serif; color: #333;">${toTitleCase(data.name)}</h1>
            
            <h2 style="margin-top: 20px; font-family: Arial, sans-serif; color: #555;">Details</h2>
            <table style="margin: 20px auto; border-collapse: collapse; font-family: Arial, sans-serif; color: #555;">
                <tr>
                <td style="padding: 8px; border: 5px solid #ddd;">Species</td>
                <td style="padding: 8px; border: 5px solid #ddd;">${toTitleCase(data.name)}</td>
                </tr>
                <tr>
                <td style="padding: 8px; border: 5px solid #ddd;">ID</td>
                <td style="padding: 8px; border: 5px solid #ddd;">${data.id}</td>
                </tr>
                <tr>
                <td style="padding: 8px; border: 5px solid #ddd;">Height</td>
                <td style="padding: 8px; border: 5px solid #ddd;">${data.height}</td>
                </tr>
                <tr>
                <td style="padding: 8px; border: 5px solid #ddd;">Weight</td>
                <td style="padding: 8px; border: 5px solid #ddd;">${data.weight}</td>
                </tr>
                <tr>
                <td style="padding: 8px; border: 5px solid #ddd;">Base Experience</td>
                <td style="padding: 8px; border: 5px solid #ddd;">${data.base_experience}</td>
                </tr>
                <tr>
                <td style="padding: 8px; border: 5px solid #ddd;">Abilities</td>
                <td style="padding: 8px; border: 5px solid #ddd;">${data.abilities.map(a => a.ability.name).join(', ')}</td>
                </tr>
                <tr>
                <td style="padding: 8px; border: 5px solid #ddd;">Type</td>
                <td style="padding: 8px; border: 5px solid #ddd;">${data.types.map(t => t.type.name).join(', ')}</td>
                </tr>
            </table>

            <h2 style="margin-top: 20px; font-family: Arial, sans-serif; color: #555;">Stats</h2>
            <table style="margin: 20px auto; border-collapse: collapse; width: 80%; font-family: Arial, sans-serif; color: #555;">
                ${data.stats.map(s => 
                `
                <tr>
                    <td style="padding: 8px; border: 5px solid #ddd;">${s.stat.name}</td>
                    <td style="padding: 8px; border: 5px solid #ddd;">${s.base_stat}</td>
                </tr>
                `).join('')}
            </table>
            </div>
        </div> `;
    }
});

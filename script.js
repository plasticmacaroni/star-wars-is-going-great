// Load the timeline on page load
window.addEventListener('load', loadTimeline);

// Fetch and process the YAML data
async function loadTimeline() {
    try {
        const response = await fetch('data.yaml'); // Ensure 'data.yaml' is in the correct path
        if (!response.ok) throw new Error('Failed to fetch the YAML file');

        const yamlText = await response.text();
        const entries = parseYAML(yamlText);
        renderTimeline(entries);
    } catch (error) {
        console.error('Error loading the timeline:', error);
    }
}

// Parse the YAML file into usable data
function parseYAML(yamlText) {
    try {
        const yaml = window.jsyaml;
        return yaml.load(yamlText) || [];
    } catch (error) {
        console.error('Error parsing YAML:', error);
        return [];
    }
}

// Render the timeline on the page
function renderTimeline(entries) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = ''; // Clear existing content

    // Sort entries by date descending
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    let isLeft = true; // Flag to alternate sides

    entries.forEach(entry => {
        // Create timeline item
        const item = document.createElement('div');
        item.classList.add('timeline-item');

        // Assign 'left' or 'right' class
        item.classList.add(isLeft ? 'left' : 'right');
        isLeft = !isLeft;

        // Create content container
        const content = document.createElement('div');
        content.classList.add('timeline-content');

        // Add background image
        if (entry.image) {
            const img = document.createElement('img');
            img.src = entry.image;
            img.alt = entry.title || 'Image';
            content.appendChild(img);
        }

        // Add title
        if (entry.title) {
            const title = document.createElement('h2');
            title.textContent = entry.title;
            content.appendChild(title);
        }

        // Add date and media type
        if (entry.date && entry.media_type) {
            const dateMedia = document.createElement('p');
            dateMedia.textContent = `${entry.date} | ${entry.media_type}`;
            content.appendChild(dateMedia);
        }

        // Add status
        if (entry.status) {
            const status = document.createElement('p');
            status.textContent = `Status: ${entry.status}`;
            content.appendChild(status);
        }

        // Add description
        if (entry.description) {
            const description = document.createElement('p');
            description.textContent = entry.description;
            content.appendChild(description);
        }

        // Add scores
        if (entry.scores && Array.isArray(entry.scores)) {
            const scoresContainer = document.createElement('div');
            scoresContainer.classList.add('scores-container');

            entry.scores.forEach(score => {
                let scoreElement;
                if (score.source) {
                    scoreElement = document.createElement('a');
                    scoreElement.href = score.source;
                    scoreElement.target = '_blank';
                } else {
                    scoreElement = document.createElement('div');
                }

                // Add classes
                scoreElement.classList.add('score-box');

                // Generate a class-friendly version of the score type
                const scoreTypeClass = score.type.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
                scoreElement.classList.add(scoreTypeClass);

                // Add the icon image if it exists
                const iconPath = getIconPath(score.type);
                const iconImg = document.createElement('img');
                iconImg.src = iconPath;
                iconImg.alt = ''; // Prevent text from showing if image doesn't load
                iconImg.classList.add('score-icon');

                // Hide the image if it fails to load
                iconImg.onerror = function () {
                    this.style.display = 'none';
                };

                scoreElement.appendChild(iconImg);

                // Add score value
                const scoreSpan = document.createElement('span');
                scoreSpan.textContent = score.score || '';
                scoreElement.appendChild(scoreSpan);

                scoresContainer.appendChild(scoreElement);
            });

            content.appendChild(scoresContainer);
        }

        // Append content to item
        item.appendChild(content);

        // Add status icon instead of dot
        const statusIcon = document.createElement('div');
        statusIcon.classList.add('status-icon');
        statusIcon.innerHTML = getStatusIconHTML(entry.status);

        // Add the status icon to the timeline item
        item.appendChild(statusIcon);

        // Append item to timeline
        timeline.appendChild(item);
    });
}

// Function to get the icon path for a given score type
function getIconPath(scoreType) {
    // Create a filename-friendly version of the score type
    const fileName = scoreType.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9\-_]/g, '');

    // We'll assume the file exists with a .png extension
    // The image's onerror event will handle missing files
    return `icons/${fileName}.png`;
}

// Function to get the HTML for the status icon
function getStatusIconHTML(status) {
    let iconClass = '';
    switch (status.toLowerCase()) {
        case 'released':
            iconClass = 'fa-solid fa-circle-check'; // Checkmark icon
            break;
        case 'unreleased':
            iconClass = 'fa-solid fa-circle'; // Circle icon
            break;
        case 'partially completed':
            iconClass = 'fa-solid fa-exclamation-circle'; // Exclamation icon
            break;
        case 'cancelled':
            iconClass = 'fa-solid fa-circle-xmark'; // Cross icon
            break;
        default:
            iconClass = 'fa-solid fa-question-circle'; // Question mark for unknown status
    }
    return `<i class="${iconClass}"></i>`;
}

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
    entries.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });

    let isLeft = true; // Flag to alternate sides

    entries.forEach(entry => {
        // Create timeline item
        const item = document.createElement('div');
        item.classList.add('timeline-item');

        // Assign 'left' or 'right' class
        item.classList.add(isLeft ? 'left' : 'right');
        isLeft = !isLeft;

        // Check if the status indicates cancellation
        if (isCancelled(entry.status)) {
            item.classList.add('cancelled');
        }

        // Create content container
        const content = document.createElement('div');
        content.classList.add('timeline-content');

        // Set background image if it exists
        if (entry.image) {
            content.style.backgroundImage = `url(${entry.image})`;
        } else {
            content.style.backgroundImage = 'none';
        }

        // Add title
        if (entry.title) {
            const title = document.createElement('h2');
            title.textContent = entry.title;
            content.appendChild(title);
        }

        // Add date and media type
        if (entry.media_type) {
            const dateToDisplay = entry.display_date || entry.date || 'Date Unknown';
            const dateMedia = document.createElement('p');
            dateMedia.textContent = `${dateToDisplay} | ${entry.media_type}`;
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
            // Separate scores into Critics and Users
            const criticScores = [];
            const userScores = [];

            entry.scores.forEach(score => {
                const typeLower = score.type.toLowerCase();
                if (typeLower.includes('critic') || typeLower.includes('metascore')) {
                    criticScores.push(score);
                } else if (typeLower.includes('user') || typeLower.includes('audience')) {
                    userScores.push(score);
                }
            });

            // Create Critic Scores Container with Label
            if (criticScores.length > 0) {
                const criticScoresContainer = document.createElement('div');
                criticScoresContainer.classList.add('scores-container', 'critic-scores');

                // Create and append the label inside the container
                const criticLabel = document.createElement('h3');
                criticLabel.textContent = 'Critic Scores';
                criticLabel.classList.add('scores-label');
                criticScoresContainer.appendChild(criticLabel);

                // Append each critic score
                criticScores.forEach(score => {
                    const scoreElement = createScoreElement(score);
                    criticScoresContainer.appendChild(scoreElement);
                });

                content.appendChild(criticScoresContainer);
            }

            // Create User Scores Container with Label
            if (userScores.length > 0) {
                const userScoresContainer = document.createElement('div');
                userScoresContainer.classList.add('scores-container', 'user-scores');

                // Create and append the label inside the container
                const userLabel = document.createElement('h3');
                userLabel.textContent = 'User Scores';
                userLabel.classList.add('scores-label');
                userScoresContainer.appendChild(userLabel);

                // Append each user score
                userScores.forEach(score => {
                    const scoreElement = createScoreElement(score);
                    userScoresContainer.appendChild(scoreElement);
                });

                content.appendChild(userScoresContainer);
            }
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

// Function to create a score element
function createScoreElement(score) {
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

    // Generate a class-friendly version of the site and type
    const siteClass = score.site.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    const typeClass = score.type.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    scoreElement.classList.add(siteClass, typeClass);

    // Parse the score value and maximum score
    const { scoreValue, maxScore } = parseScore(score.score);

    // Determine background color based on score
    const backgroundColor = getScoreColor(scoreValue, maxScore);
    scoreElement.style.backgroundColor = backgroundColor;

    // Try to set the icon as background image
    const iconPath = getIconPath(score.site);
    checkImageExists(iconPath, exists => {
        if (exists) {
            // Set the icon as background image
            scoreElement.style.backgroundImage = `url(${iconPath})`;
            scoreElement.style.backgroundSize = 'contain';
            scoreElement.style.backgroundRepeat = 'no-repeat';
            scoreElement.style.backgroundPosition = 'center';
            // Apply blend mode to colorize the icon
            scoreElement.style.backgroundBlendMode = 'multiply';
        } else {
            // No icon found, background color will suffice
            scoreElement.style.backgroundImage = 'none';
        }
    });

    // Add score value
    const scoreSpan = document.createElement('span');
    scoreSpan.textContent = score.score || '';
    scoreElement.appendChild(scoreSpan);

    return scoreElement;
}

// Function to check if the status indicates cancellation
function isCancelled(status) {
    const cancelledKeywords = ['cancelled', 'canceled', 'halted', 'terminated'];
    return cancelledKeywords.some(keyword => status.toLowerCase().includes(keyword));
}

// Function to parse score value and determine max score
function parseScore(scoreStr) {
    let scoreValue = parseFloat(scoreStr.replace(/[^0-9.]/g, ''));
    let maxScore = 10; // Default max score

    if (scoreStr.includes('%')) {
        maxScore = 100;
    } else if (scoreStr.includes('/10')) {
        maxScore = 10;
    } else if (scoreStr.includes('/5')) {
        maxScore = 5;
    } else if (scoreValue > 10) {
        // Assuming scores above 10 have a max of 100
        maxScore = 100;
    }

    return { scoreValue, maxScore };
}

// Function to get the color based on the score (0-1 scale)
function getScoreColor(scoreValue, maxScore) {
    // Normalize score to a 0-1 scale
    const normalizedScore = scoreValue / maxScore;

    // Map normalized score to a hue value (red to green)
    const hue = normalizedScore * 85;
    return `hsl(${hue}, 70%, 50%)`;
}

// Function to get the icon path for a given site
function getIconPath(site) {
    const siteName = site.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9\-_]/g, '');
    return `icons/${siteName}.png`;
}

// Function to check if an image exists at a given URL
function checkImageExists(url, callback) {
    const img = new Image();
    img.onload = function () {
        callback(true);
    };
    img.onerror = function () {
        callback(false);
    };
    img.src = url;
}

// Function to get the HTML for the status icon
function getStatusIconHTML(status) {
    let iconClass = '';
    let statusClass = ''; // New variable to hold the status-based class
    switch (status.toLowerCase()) {
        case 'released':
        case 'occurred':
            iconClass = 'fa-solid fa-circle-check'; // Checkmark icon
            statusClass = 'status-released';
            break;
        case 'unreleased':
            iconClass = 'fa-solid fa-circle'; // Circle icon
            statusClass = 'status-unreleased';
            break;
        case 'partially completed':
            iconClass = 'fa-solid fa-exclamation-circle'; // Exclamation icon
            statusClass = 'status-partially-completed';
            break;
        case 'cancelled':
        case 'canceled':
        case 'allegedly cancelled by disney':
        case 'allegedly canceled by disney':
        case 'cancelled after season 1':
            iconClass = 'fa-solid fa-circle-xmark'; // Cross icon
            statusClass = 'status-cancelled';
            break;
        case 'uncertain':
            iconClass = 'fa-solid fa-question-circle'; // Question mark icon
            statusClass = 'status-uncertain';
            break;
        case 'in production':
            iconClass = 'fa-solid fa-film'; // Film icon
            statusClass = 'status-in-production';
            break;
        case 'in development':
            iconClass = 'fa-solid fa-hammer'; // Hammer icon
            statusClass = 'status-in-development';
            break;
        case 'upcoming release':
            iconClass = 'fa-solid fa-star'; // Star icon
            statusClass = 'status-upcoming-release';
            break;
        default:
            iconClass = 'fa-solid fa-question-circle'; // Default to question mark
            statusClass = 'status-unknown';
    }
    // Include the status-based class in the <i> element
    return `<i class="${iconClass} ${statusClass}"></i>`;
}

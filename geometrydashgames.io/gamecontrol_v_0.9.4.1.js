// Cache for the fullscreen module
let fullscreenModulePromise = null;

// Function to detect mobile device
function isMobileDevice() {
    // Use a regular expression to test the user agent for mobile devices
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Function to get the fullscreen module
const getFullscreenModule = () => {
    if (!fullscreenModulePromise) {
        fullscreenModulePromise = Promise.resolve({
            enterFullscreen: enterFullscreen,
            exitFullscreen: exitFullscreen,
            handleFullscreenChange: handleFullscreenChange,
            autoEnterFullscreen: autoEnterFullscreen,
        });
    }
    return fullscreenModulePromise;
};

// Function to check if the user is on a mobile device
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Function to check if the device is in landscape orientation
function isLandscape() {
    return window.innerWidth > window.innerHeight;
}

// Function to handle fullscreen mode on mobile devices
function handleMobileFullscreen(gameContainer, gameIframe, fullscreenBtn, exitFullscreenBtn, domainWatermark) {
    if (!gameContainer) {
        return;
    }
    // Delay showing the domain watermark by 1 second
    setTimeout(function() {
        domainWatermark.style.display = 'block';
    }, 1000);
    
    // Set the game container to fill the entire screen
    gameContainer.style.height = '100vh';
    gameContainer.style.width = '100vw';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '0';
    gameContainer.style.left = '0';
    gameContainer.style.zIndex = '9999';
    gameContainer.style.backgroundColor = '#000';

    // Show the exit button and hide the fullscreen button
    fullscreenBtn.style.display = 'none';
    exitFullscreenBtn.style.display = 'block';

    // Position the exit button
    exitFullscreenBtn.style.position = 'fixed';
    exitFullscreenBtn.style.zIndex = '10000';

    // Adjust the game iframe and exit button styles based on orientation
    if (isLandscape()) {
        gameIframe.style.width = '100vw';
        gameIframe.style.height = '100vh';
        gameIframe.style.transform = 'none';
        gameIframe.style.position = 'static';
        
        exitFullscreenBtn.style.transform = 'none';
        
        domainWatermark.style.display = 'block';
    } else {
        gameIframe.style.width = '100vh';
        gameIframe.style.height = '100vw';
        gameIframe.style.transform = 'rotate(90deg)';
        gameIframe.style.transformOrigin = 'top left';
        gameIframe.style.position = 'absolute';
        gameIframe.style.top = '0';
        gameIframe.style.left = '100%';
        
        // exitFullscreenBtn.style.transform = 'rotate(90deg)';
        
        domainWatermark.style.display = 'none';
    }

    fullscreenBtn.style.display = 'none';
    exitFullscreenBtn.style.display = 'block';

    // Try to lock the screen to landscape orientation
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {
            console.log('Landscape lock not supported');
        });
    }
}

// Function to handle fullscreen mode on desktop devices
function handleDesktopFullscreen(gameIframe, fullscreenBtn, exitFullscreenBtn) {
    // Try to enter fullscreen mode using the available API
    if (gameIframe.requestFullscreen) {
        gameIframe.requestFullscreen();
    } else if (gameIframe.mozRequestFullScreen) {
        gameIframe.mozRequestFullScreen();
    } else if (gameIframe.webkitRequestFullscreen) {
        gameIframe.webkitRequestFullscreen();
    } else if (gameIframe.msRequestFullscreen) {
        gameIframe.msRequestFullscreen();
    }
    
    // Show the exit button and hide the fullscreen button
    fullscreenBtn.style.display = 'none';
    exitFullscreenBtn.style.display = 'block';
}

// Function to enter fullscreen mode
function enterFullscreen(gameContainer, gameIframe, fullscreenBtn, exitFullscreenBtn, domainWatermark) {
    // Handle mobile and desktop devices separately
    if (isMobile()) {
        handleMobileFullscreen(gameContainer, gameIframe, fullscreenBtn, exitFullscreenBtn, domainWatermark);
    } else {
        handleDesktopFullscreen(gameIframe, fullscreenBtn, exitFullscreenBtn);
    }
}

// Function to exit fullscreen mode
function exitFullscreen(gameContainer, gameIframe, fullscreenBtn, exitFullscreenBtn, domainWatermark) {
    // Check if currently in fullscreen mode
    if (document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement) {
            
        // Try to exit fullscreen mode
        const exitPromise = document.exitFullscreen?.() || 
                          document.webkitExitFullscreen?.() || 
                          document.mozCancelFullScreen?.() || 
                          document.msExitFullscreen?.();
        
        if (exitPromise) {
            exitPromise.catch(error => {
                console.log('Error exiting fullscreen:', error);
                updateUI();
            });
        }
    } else {
        updateUI();
    }

    // Function to update the UI after exiting fullscreen mode
    function updateUI() {
        // Reset the game container and iframe styles
        if (gameContainer) {
            gameContainer.style = '';
            // Only hide game container on mobile devices
            // if (isMobile()) {
            //     gameContainer.classList.add('hidden');
            // }
        }
        gameIframe.style = '';

        // Show the header and hide the domain watermark on mobile devices
        if (isMobile()) {
            document.querySelector('header').style.display = 'block';
            domainWatermark.style.display = 'none';
            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
        }

        // Show the fullscreen button and hide the exit button
        fullscreenBtn.style.display = 'block';
        exitFullscreenBtn.style.display = 'none';
    }
}

// Function to handle fullscreen mode changes
function handleFullscreenChange(gameContainer, gameIframe, fullscreenBtn, exitFullscreenBtn, domainWatermark) {
    // Use requestAnimationFrame to ensure UI updates in the next frame
    requestAnimationFrame(() => {
        const isFullscreen = document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement || 
                           document.msFullscreenElement;
                           
        if (!isFullscreen) {
            exitFullscreen(gameContainer, gameIframe, fullscreenBtn, exitFullscreenBtn, domainWatermark);
        }
    });
}

// Function to automatically enter fullscreen mode on mobile devices
function autoEnterFullscreen(gameContainer, gameIframe, fullscreenBtn, exitFullscreenBtn, domainWatermark) {
    if (isMobile() && !isLandscape()) {
        //handleMobileFullscreen(gameContainer, gameIframe, fullscreenBtn, exitFullscreenBtn, domainWatermark);
    }
}

const initGameControls = async () => {
    const playGameBtn = document.querySelector('.play-game');
    const gameContainer = document.querySelector('.game-container');
    const gameIframe = document.getElementById('game-iframe');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const exitFullscreenBtn = document.getElementById('exit-fullscreen-btn');
    const domainWatermark = document.getElementById('domain-watermark');

    // Pre-load the fullscreen module
    let fullscreenModule;
    try {
        fullscreenModule = await getFullscreenModule();
    } catch (error) {
        console.error('Failed to load fullscreen module:', error);
        return;
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            fullscreenModule.enterFullscreen(
                gameContainer,
                gameIframe,
                fullscreenBtn,
                exitFullscreenBtn,
                domainWatermark
            );
        });
    }

    if (exitFullscreenBtn) {
        exitFullscreenBtn.addEventListener('click', () => {
            fullscreenModule.exitFullscreen(
                gameContainer,
                gameIframe,
                fullscreenBtn,
                exitFullscreenBtn,
                domainWatermark
            );
            // Only hide game container on mobile devices
            // if (gameContainer && isMobile()) {
            //     gameContainer.classList.add('hidden');
            // }
        });
    }

    if (playGameBtn && gameContainer) {
        playGameBtn.addEventListener('click', () => {
            if (gameContainer) gameContainer.classList.remove('hidden');
            const mobileCoverArea = document.getElementById('mobile-game-cover');
            if (mobileCoverArea) {
                mobileCoverArea.classList.add('hidden');
            }
            if (fullscreenBtn) {
                fullscreenBtn.style.display = 'flex';
            }
            // fullscreenModule.enterFullscreen(
            //     gameContainer,
            //     gameIframe,
            //     fullscreenBtn,
            //     exitFullscreenBtn,
            //     domainWatermark
            // );
        });
    }

    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', () => {
        fullscreenModule.handleFullscreenChange(
            gameContainer,
            gameIframe,
            fullscreenBtn,
            exitFullscreenBtn,
            domainWatermark
        );
    });

    // Auto enter fullscreen on mobile devices in portrait mode
    window.addEventListener('load', () => {
        fullscreenModule.autoEnterFullscreen(
            gameContainer,
            gameIframe,
            fullscreenBtn,
            exitFullscreenBtn,
            domainWatermark
        );
    });

    window.addEventListener('resize', () => {
        fullscreenModule.autoEnterFullscreen(
            gameContainer,
            gameIframe,
            fullscreenBtn,
            exitFullscreenBtn,
            domainWatermark
        );
    });
};

const init = () => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    initGameControls().catch(error => {
        console.error('Failed to initialize game controls:', error);
    });
};

document.addEventListener('DOMContentLoaded', init);
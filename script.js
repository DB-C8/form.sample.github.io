document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('interactiveForm');
    const formSteps = Array.from(document.querySelectorAll('.form-step'));
    const nextBtns = Array.from(document.querySelectorAll('.next-btn'));
    const prevBtns = Array.from(document.querySelectorAll('.prev-btn'));
    const progressBar = document.getElementById('progressBar');
    const successMessage = document.getElementById('successMessage');
    let currentStep = 0;

    const navPrev = document.querySelector('.nav-prev');
    const navNext = document.querySelector('.nav-next');
 
    // Show the first step
    showStep(currentStep);

    // Next Button Event Listeners
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                animateStep('next');
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // Previous Button Event Listeners
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            animateStep('prev');
            currentStep--;
            showStep(currentStep);
        });
    });

    // Real-time Validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.checkValidity()) {
                input.classList.remove('is-invalid');
            }
        });
    });

    // Function to show a specific step
    function showStep(step) {
        formSteps.forEach((formStep, index) => {
            if (index === step) {
                formStep.classList.add('active', 'animate__animated', 'animate__fadeIn');
                gsap.fromTo(formStep, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.5 });
            } else {
                formStep.classList.remove('active', 'animate__animated', 'animate__fadeIn');
            }
        });
        updateProgressBar(step);
        updateNavigationArrows();
        if (step === formSteps.length - 1) {
            populateReview();
        }

        // Handle corner logo visibility
        const cornerLogo = document.querySelector('.corner-logo');
        if (cornerLogo) {
            if (step === 0) { // First page/step
                cornerLogo.style.display = 'none';
            } else {
                cornerLogo.style.display = 'block';
            }
        }
    }

    // Function to update the progress bar
    function updateProgressBar(step) {
        const stepPercentage = ((step) / (formSteps.length - 1)) * 100;
        progressBar.style.width = `${stepPercentage}%`;
        progressBar.setAttribute('aria-valuenow', stepPercentage);
    }

    // Function to validate current step
    function validateStep(step) {
        const currentFormStep = formSteps[step];
        const inputs = currentFormStep.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (input.id === 'website') {
                // Special validation for website field
                isValid = validateWebsiteURL(input.value);
                if (!isValid) {
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            } else {
                if (!input.checkValidity()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }

                // Additional validation for phone number
                if (input.id === 'phone') {
                    const phonePattern = /^\+?\d{10,15}$/;
                    if (!phonePattern.test(input.value.trim())) {
                        input.classList.add('is-invalid');
                        isValid = false;
                    }
                }

                // Additional validation for confirm password
                if (input.id === 'confirmPassword') {
                    const password = document.getElementById('password').value;
                    if (input.value !== password || input.value === '') {
                        input.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        input.classList.remove('is-invalid');
                    }
                }
            }
        });

        return isValid;
    }

    // Function to populate review information
    function populateReview() {
        const orgName = document.getElementById('orgName')?.value || '';
        const firstName = document.getElementById('firstName')?.value || '';
        const lastName = document.getElementById('lastName')?.value || '';
        const phone = document.getElementById('phone')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const hasWebsite = document.getElementById('hasWebsite')?.value || '';
        const website = document.getElementById('website')?.value || '';
        const budget = document.getElementById('budget')?.value || '';

        document.getElementById('reviewOrgName').textContent = orgName;
        document.getElementById('reviewFullName').textContent = `${firstName} ${lastName}`;
        document.getElementById('reviewPhone').textContent = phone;
        document.getElementById('reviewEmail').textContent = email;
        document.getElementById('reviewWebsite').textContent = hasWebsite === 'no' ? 'N/A' : website;
        document.getElementById('reviewBudget').textContent = formatBudgetRange(budget);
    }

    // Function to animate steps
    function animateStep(direction) {
        if (direction === 'next') {
            gsap.to(formSteps[currentStep], { x: -100, duration: 0.3, ease: "power1.in" });
        } else {
            gsap.to(formSteps[currentStep], { x: 100, duration: 0.3, ease: "power1.in" });
        }
    }

    // Updated Enter key handler
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission
            
            if (validateStep(currentStep)) {
                // If it's not the last step, move to next step
                if (currentStep < formSteps.length - 1) {
                    animateStep('next');
                    currentStep++;
                    showStep(currentStep);
                }
                // If it's the last step, submit the form
                else if (currentStep === formSteps.length - 1) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        }
    });

    // Show/hide navigation arrows based on current step
    function updateNavigationArrows() {
        const prevButton = document.querySelector('.nav-prev');
        const nextButton = document.querySelector('.nav-next');
        
        // Hide previous button on first step (step 1)
        if (currentStep === 0) {
            prevButton.classList.add('d-none');
        } else {
            prevButton.classList.remove('d-none');
        }
        
        // Hide next button on last step
        if (currentStep === formSteps.length - 1) {
            nextButton.classList.add('d-none');
        } else {
            nextButton.classList.remove('d-none');
        }

        // Hide both arrows on first and last steps
        if (currentStep === 0 || currentStep === formSteps.length - 1) {
            prevButton.classList.add('d-none');
            nextButton.classList.add('d-none');
        }
    }

    // Navigation arrow event listeners
    navPrev.addEventListener('click', () => {
        if (currentStep > 0) {
            animateStep('prev');
            currentStep--;
            showStep(currentStep);
        }
    });

    navNext.addEventListener('click', () => {
        if (currentStep < formSteps.length - 1 && validateStep(currentStep)) {
            animateStep('next');
            currentStep++;
            showStep(currentStep);
        }
    });

    // Submit button event listener
    document.getElementById('submitBtn').addEventListener('click', async () => {
        // Collect form data
        const formData = {
            orgName: document.getElementById('orgName').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            website: document.getElementById('website').value,
            budget: document.getElementById('budget').value,
            // Add other fields as necessary
        };

        // Send form data to Azure Function
        try {
            const response = await fetch('https://form-data-transfer.azurewebsites.net/api/saveFormData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Hide the form
                const formElement = document.getElementById('interactiveForm');
                gsap.to(formElement, { 
                    duration: 0.5, 
                    opacity: 0, 
                    y: -20, 
                    onComplete: () => {
                        formElement.style.display = 'none';
                        const successMessage = document.getElementById('successMessage');
                        successMessage.style.display = 'block';
                        successMessage.classList.remove('d-none');
                        
                        gsap.fromTo(successMessage, 
                            { opacity: 0, y: 20 }, 
                            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                        );
                    }
                });
            } else {
                // Handle error response
                console.error('Error saving form data:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Remove or comment out the existing form submit event listener
    // form.addEventListener('submit', (e) => { ... });

    // Add this to your navigation handling code
    function clearFieldBackground() {
        // Clear autofill background
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('animationstart', function(e) {
                if (e.animationName === 'autofill') {
                    this.style.backgroundColor = 'transparent';
                }
            });
            
            // Force background to be transparent
            input.style.backgroundColor = 'transparent';
        });
    }

    $(document).ready(function() {
        $('select.form-control').select2({
            minimumResultsForSearch: Infinity,
            dropdownParent: $('body'),
            width: '100%',
            placeholder: 'Please select',
            allowClear: false,
            dropdownPosition: 'below',
            dropdownAutoWidth: true,
            maximumDropdownHeight: '80vh', // Ensures dropdown is fully visible
        });

        // Handle enter key for select elements
        $('select.form-control').on('select2:select', function(e) {
            if (validateStep(currentStep)) {
                setTimeout(() => {
                    if (currentStep < formSteps.length - 1) {
                        animateStep('next');
                        currentStep++;
                        showStep(currentStep);
                    }
                }, 100);
            }
        });
    });

    // Add this to your existing JavaScript
    document.addEventListener('DOMContentLoaded', function() {
        // Handle back/forward navigation
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                // Reset all form fields to their default state
                document.querySelectorAll('input, select, textarea').forEach(field => {
                    if (field.type !== 'hidden') {
                        // Clear any background color
                        field.style.backgroundColor = 'transparent';
                        field.style.color = '#FFFFFF';
                    }
                });

                // Reset Select2 fields
                $('select').each(function() {
                    if ($(this).data('select2')) {
                        $(this).select2('destroy');
                    }
                    $(this).select2({
                        minimumResultsForSearch: Infinity,
                        dropdownParent: $('body'),
                        width: '100%',
                        placeholder: 'Please select',
                        allowClear: false
                    });
                });
            }
        });

        // Clear autocomplete styles on page load
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('focus', function() {
                this.style.backgroundColor = 'transparent';
                this.style.color = '#FFFFFF';
            });
        });

        const cornerLogo = document.querySelector('.corner-logo');
        if (cornerLogo) {
            cornerLogo.style.display = 'none'; // Hide on initial load
        }
    });

    // Custom cursor implementation
    function initCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        
        if (!cursor) return;

        let isMoving = false;
        let cursorX = 0;
        let cursorY = 0;

        // Smooth movement function
        function moveCursor() {
            if (!isMoving) return;
            
            const e = window.event;
            if (!e) return;

            cursorX = e.clientX;
            cursorY = e.clientY;
            
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(moveCursor);
        }

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            isMoving = true;
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(moveCursor);
        });

        document.addEventListener('mouseleave', () => {
            isMoving = false;
            cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            isMoving = true;
            cursor.style.opacity = '1';
            requestAnimationFrame(moveCursor);
        });

        // Interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .select2-container');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        // Click effects
        document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
        document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
    }

    // Initialize cursor when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCustomCursor);
    } else {
        initCustomCursor();
    }

    // Update the website validation and formatting
    function formatWebsiteUrl(url) {
        if (!url) return url;
        
        // Remove multiple forward slashes and whitespace
        url = url.trim().replace(/([^:]\/)\/+/g, "$1");
        
        // Add https:// if no protocol is specified
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        
        return url;
    }

    // Function to format budget range
    function formatBudgetRange(budgetValue) {
        if (!budgetValue) return 'N/A';
        
        const ranges = {
            '0-5000': '$0 - $5,000',
            '5000-10000': '$5,000 - $10,000',
            '10000-25000': '$10,000 - $25,000',
            '25000+': '$25,000+'
        };
        
        return ranges[budgetValue] || budgetValue;
    }

    // Update the website selection handler
    $('#hasWebsite').on('select2:select', function(e) {
        const selectedValue = e.params.data.id;
        
        if (validateStep(currentStep)) {
            if (selectedValue === 'no') {
                // Set website value to N/A
                document.getElementById('website').value = 'N/A';
                // Skip the website URL step
                currentStep++; // Move to website URL step
                animateStep('next');
                currentStep++; // Skip to the next step after website URL
                showStep(currentStep);
            } else {
                // Normal next step behavior
                animateStep('next');
                currentStep++;
                showStep(currentStep);
            }
        }
    });

    // Remove the website handling from the next button click handler
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                animateStep('next');
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // Update the URL validation function
    function validateWebsiteURL(url) {
        // Accept "N/A" as valid
        if (url === "N/A") return true;
        
        // Regular URL validation
        try {
            // Check if it's a valid URL format
            new URL(url);
            return true;
        } catch (e) {
            // If URL doesn't start with http:// or https://, try adding https://
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                try {
                    new URL('https://' + url);
                    return true;
                } catch (e) {
                    return false;
                }
            }
            return false;
        }
    }
});

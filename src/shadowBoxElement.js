export {shadowBox};

let shadowBox = {
    element: function () {
        let element = document.createElement('div');
        element.className = 'dashgrid-shadow-box';
        element.style.position = 'absolute';
        element.style.display = '';
        element.style.zIndex = 1002;

        // Initialize.
        if (document.getElementById('dashgrid-shadow-box') === null) {
            // let shadowBox = ShadowBox();
            // dashgrid._element.appendChild(dashgrid._shadowBoxElement);
        }

        return element;
    }
};

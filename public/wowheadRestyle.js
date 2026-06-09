(function() {
    var observer;

    function styleTooltip(el) {
        observer.disconnect();

        el.querySelectorAll('th, td, table, tr').forEach(function(n) {
            n.style.setProperty('background-image', 'none', 'important');
            n.style.setProperty('background', 'transparent', 'important');
            n.style.setProperty('background-color', 'transparent', 'important');
        });

        removeAllIcons();
        var ins = el.querySelector('.whtt-tooltip-icon .iconmedium ins');
        if (ins && ins.style.backgroundImage) {
            var bg = ins.style.backgroundImage;
            var iconRe = new RegExp('icons/(medium|large|small)/([^."]+)');
            var match = bg.match(iconRe);
            if (match) {
                var iconName = match[2];
                var localSrc = '/icons/' + iconName + '.png';
                var fallbackSrc = 'https://wow.zamimg.com/images/wow/icons/large/' + iconName + '.jpg';
                var img = document.createElement('img');
                img.className = 'wh-icon';
                img.onerror = function() { this.src = fallbackSrc; };
                img.src = localSrc;

                var tooltipTop = parseFloat(el.style.top) || 0;
                var tooltipLeft = parseFloat(el.style.left) || 0;
                var wrapper = document.createElement('div');
                wrapper.className = 'wh-icon-wrapper';
                wrapper.style.cssText = 'position:absolute;width:40px;height:40px;border-radius:4px;overflow:hidden;border:1px solid #575757;top:' + (tooltipTop + 1) + 'px;left:' + (tooltipLeft - 43) + 'px;z-index:' + (parseInt(el.style.zIndex) || 9999) + ';';
                img.style.cssText = 'width:40px;height:40px;object-fit:cover;transform:scale(1.15);transform-origin:center;pointer-events:none;';
                wrapper.appendChild(img);
                el.parentNode.appendChild(wrapper);
            }
        }

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-visible'],
        });
    }

    function removeAllIcons() {
        document.querySelectorAll('.wh-icon-wrapper').forEach(function(el) {
            el.parentNode.removeChild(el);
        });
    }

    observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
            if (m.type === 'attributes' && m.attributeName === 'data-visible') {
                if (m.target.classList && m.target.classList.contains('wowhead-tooltip')) {
                    if (m.target.dataset.visible === 'yes') {
                        var target = m.target;
                        setTimeout(function() { styleTooltip(target); }, 50);
                    } else {
                        removeAllIcons();
                    }
                }
            }
            m.addedNodes.forEach(function(n) {
                if (n.nodeType === 1 && n.classList && n.classList.contains('wowhead-tooltip')) {
                    setTimeout(function() { styleTooltip(n); }, 50);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-visible'],
    });
})();

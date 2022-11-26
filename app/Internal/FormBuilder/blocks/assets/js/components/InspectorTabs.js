import './css/inspectorTabs.scss';
import classnames from 'classnames';
const { __ } = wp.i18n;
const { Fragment, cloneElement, Children } = wp.element;
const { Tooltip } = wp.components;

const { useState, useRef, useEffect } = wp.element,
    ANNUAL = 'annual',
    LIFETIME = 'lifetime';


const InspectorTabs = props => {
    const { defaultTab, children, tabs, showPlan } = props,
        [currentTab, setCurrentTab] = useState(defaultTab ? defaultTab : tabs[0]),
        tabContainer = useRef(),
        offset = useRef(undefined);

    let sidebarPanel;



    useEffect(() => {
        sidebarPanel = tabContainer.current.closest('.components-panel');
    });
    const observer = new IntersectionObserver(([e]) => e.target.classList.toggle('getwpf-is-sticky', e.intersectionRatio < 1), { threshold: [1] });

    // component did mount
    useEffect(() => {
        // sticky tabs menu
        const container = document.querySelector('.getwpf-inspector-tabs-container');
        if (container) {
            observer.observe(container);
        }

        // component will unmount
        return () => {
            sidebarPanel && sidebarPanel.removeAttribute('data-getwpf-tab');
        }
    }, []);

    useEffect(() => {
        sidebarPanel && sidebarPanel.setAttribute('data-getwpf-tab', defaultTab)
    }, [defaultTab]);

    const _onTabChange = tab => {
        setCurrentTab(tab);
        sidebarPanel && sidebarPanel.setAttribute('data-getwpf-tab', tab);
        props.changetTab(tab)
    };

    return (
        <Fragment>
            <div className={'getwpf-inspector-tabs-container'}>
                {
                    /*
                     * The tabs is static, you must use layout, style & advance
                     */
                }
                <div ref={tabContainer} className={classnames(
                    'getwpf-inspector-tabs',
                    'getwpf-inspector-tabs-count-' + tabs.length,
                    currentTab
                )}>
                    {
                        tabs.indexOf(ANNUAL) > -1 && (
                            <Tooltip text={__('Annual')}>
                                <button className={classnames({ 'getwpf-active': currentTab === ANNUAL })} onClick={() => _onTabChange(ANNUAL)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15"><path fill="#565D66" fillRule="nonzero" d="M14.346 0H1.654C1.017 0 .5.517.5 1.154v12.692C.5 14.483 1.017 15 1.654 15h12.692c.637 0 1.154-.517 1.154-1.154V1.154C15.5.517 14.983 0 14.346 0zm-5.77 13.846v-5.77h5.77v5.77h-5.77z" /></svg>
                                    <h5>{__('Annual')}</h5>
                                </button>
                            </Tooltip>
                        )
                    }

                    {
                        tabs.indexOf(LIFETIME) > -1 && (
                            <Tooltip text={__('Lifetime')}>
                                <button className={classnames({ 'getwpf-active': currentTab === LIFETIME })} onClick={() => _onTabChange(LIFETIME)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21"><g fill="#565D66" fillRule="nonzero"><path d="M15.12 12.091a.814.814 0 00-.68-.378.814.814 0 00-.68.378c-.531.863-2.252 3.807-2.252 5.09 0 1.598 1.317 2.901 2.932 2.901s2.933-1.303 2.933-2.902c0-1.303-1.722-4.226-2.253-5.089zm-1.041 3.828c-.043.063-.744 1.198-.213 1.976a.52.52 0 01.064.358.409.409 0 01-.191.294.608.608 0 01-.255.084.476.476 0 01-.383-.21c-.871-1.283.149-2.902.192-2.986a.517.517 0 01.297-.21.534.534 0 01.361.063c.192.126.255.42.128.63zM13.314 10.388l1.36-.147c.446-.042.807-.337.935-.736.127-.4.042-.862-.276-1.157L7.258.294c-.255-.252-.68-.252-.957 0a.68.68 0 000 .947l.34.336-5.1 5.047C.82 7.339.5 8.348.67 9.379c.128.652.489 1.24.956 1.703l3.082 3.05c.467.462 1.062.82 1.72.946a3.134 3.134 0 002.785-.863l3.612-3.575a.74.74 0 01.489-.252zM7.576 2.502l5.759 5.7H2.073c.085-.232.212-.463.403-.653l5.1-5.047z" /></g></svg>
                                    <h5>{__('Lifetime')}</h5>
                                </button>
                            </Tooltip>
                        )
                    }

                </div>
            </div>
            {
                Array.isArray(children) && Children.map(children, (child, index) => {
                    if (!child.key) {
                        throw new Error('props.key not found in <InspectorTab />, you must use `key` prop');
                        return;
                    }
                    return cloneElement(child, {
                        index,
                        isActive: child.key === currentTab
                    })

                })
            }
        </Fragment>
    )
};

InspectorTabs.defaultProps = {
    defaultTab: null,
    tabs: ['layout', 'style', 'advance']
}

export default InspectorTabs;
const {__} = wp.i18n
const { Fragment } = wp.element;

export default (props) => {
    return (
        <div id={(props.index==0) ? 'first-single-item' : ''} className={ 'mrmTypography-single-block-item ' + (( props.types == 'inactive' && props.data.pro == true ) ? 'inactive' : '') }>
            <div className="mrmTypography-single-item-inner">
                <div className="mrmTypography-default-template-image">
                    <img className="lazy" alt={__('Lazy Loading')} src={ mrmTypography_admin.plugin+'assets/img/image-loader.gif'} data-src={props.backgroundImage(props.data.image)} />
                    { props.data.pro && <span className="mrmTypography-pro">{__('Pro')}</span> }
                </div>{/* mrmTypography-default-template-image */}
                <div className="mrmTypography-tmpl-info">
                    <div className="mrmTypography-import-button-group">
                        { props.itemType != 'comming' ?
                            <Fragment>
                                { props.data.liveurl && <a className="mrmTypography-button" target="_blank" href={props.data.liveurl}><i className="fa fa-share"/> {__('Preview')} </a> }
                                { (props.types == 'inactive' && props.data.pro == true) ? 
                                    <a className="mrmTypography-button-download" target="_blank" href="https://www.themeum.com/product/mrmTypography/">
                                        <i className="fas fa-upload"/> {__('Upgrade to Pro')}
                                    </a>
                                    :    
                                    <a className="mrmTypography-button mrmTypography-button-download" onClick={(e) => { props.importLayoutBlock( props.data, props.data.pro ) } }> 
                                        { props.spinner == props.data.ID ? <i className="fas fa-spinner fa-pulse"/> : <i className="fas fa-download"/>}{__('Import')} 
                                    </a>
                                }
                            </Fragment>
                            :
                            <div className="mrmTypography-coming-soon" style={{color:'#ffffff'}}>{__('Coming Soon.')}</div>
                        }
                    </div>{/* mrmTypography-import-button-group */}
                </div>{/* mrmTypography-tmpl-info */}
            </div>{/* mrmTypography-single-item-inner */}
            <h4 className="mrmTypography-tmpl-title" dangerouslySetInnerHTML={{__html:props.data.name}}/>
        </div>
    )
}
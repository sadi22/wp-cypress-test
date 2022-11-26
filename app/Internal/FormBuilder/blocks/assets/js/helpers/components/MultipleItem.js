const {__} = wp.i18n
export default (props) => {

    return (
        <div className="mrmTypography-multiple-template-box">
            <div className="multiple-template-view" onClick={ () => props.onClickSingleEntity( props.data.ID ) } >
                <div className="mrmTypography-default-template-image"><img alt={__('Default template')} src={props.backgroundImage(props.data.image)} srcSet={props.backgroundImage(props.data.image)+ ' 2x'}/>
                { props.data.pro &&
                    <span className="mrmTypography-pro"> {__('Pro')} </span>
                }</div>
                <div className="mrmTypography-tmpl-info">
                    <h5 className="mrmTypography-tmpl-title" dangerouslySetInnerHTML={{__html:props.data.name}}/>
                    <span className="mrmTypography-temp-count">{ props.totalLayouts } {__('Layouts')}</span>
                </div>
            </div>
        </div>
    )
}


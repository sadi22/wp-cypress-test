import Typography from "./Typography"


//functions
import {
    CssGenerator,
    objectReplace,
    objectAppend,
    singleField
} from './CssGenerator'

import {withCSSGenerator} from '../hooks'

wp.wpfnlComponents = {
    Typography,
	CssGenerator: {
		CssGenerator,
		objectReplace,
		objectAppend,
		singleField
	},
}

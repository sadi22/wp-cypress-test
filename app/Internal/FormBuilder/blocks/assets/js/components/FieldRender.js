import Typography from "./Typography"

import InspectorTabs from '../components/InspectorTabs'
import InspectorTab from '../components/InspectorTab'

//functions
import {
    CssGenerator,
    objectReplace,
    objectAppend,
    singleField
} from './CssGenerator'

import {withCSSGenerator} from '../hooks'
import Tabs from "./fields/Tabs";
import Tab from "./fields/Tab";

wp.getWpfComponents = {
    Typography,
	CssGenerator: {
		CssGenerator,
		objectReplace,
		objectAppend,
		singleField,
	},
	Tabs,
	Tab,
	InspectorTabs,
	InspectorTab,
}

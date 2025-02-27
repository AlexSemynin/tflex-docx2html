export default {
	 '*': 				require('./converter')
	,'document':		require('./document')
	,'hyperlink': 		require('./a')
	,'bookmarkStart': 	require('./bookmark')
	,'drawing.anchor':	require("./drawingAnchor")
	,'fieldBegin':		require('./fieldBegin')
	,'fieldEnd':		require('./fieldEnd')
	,'footer':			require('./footer')
	,'drawing.inline':	require('./graphic')
	,'heading':			require('./h')
	,'header':			require('./header')
	,'image':			require('./img')
	,'list':			require('./list')
	,'paragraph':		require('./p')
	,'section':			require('./section')
	,'Shape':			require('./Shape')
	,'inline':			require('./span')
	,'table':			require('./table')
	,'cell':			require('./td')
	,'text':			require('./text')
	,'textbox':			require('./textbox')
	,'row':				require('./tr')
	
	,'field.hyperlink':	require('./field/hyperlink')
	
	,'style.document':	require('./style/document')
	,'style.inline':		require('./style/inline')
	,'style.numbering.definition':	require('./style/list')
	,'style.paragraph':	require('./style/paragraph')
	,'style.table':		require('./style/table')
}
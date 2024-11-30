import type {Meta, StoryObj} from '@storybook/react';

import {createFromIconfont} from './index.tsx';


/**
 * iconfont组件,需要先通过createFromIconfont函数创建,
 * 例如const IconFont = createFromIconfont('//at.alicdn.com/t/c/font_3590692_mp9kgduugne.js')
 * */
const IconFont = createFromIconfont('//at.alicdn.com/t/c/font_3590692_mp9kgduugne.js')

const meta = {
	title: 'IconFont',
	component: IconFont,
	args: {
		color: '#333',
		size: '1em',
		spin: false,
		style: {},
		type: '',
		className: ''
	},
	parameters: {
		docs: {
			description: {
				component: 'iconfont组件,需要先通过createFromIconfont函数创建,例如const IconFont = createFromIconfont(\'//at.alicdn.com/t/c/font_3590692_mp9kgduugne.js\')',
			},
		},
	},
	argTypes:{
		color:{
			description:'颜色',
		},
		size:{
			description:'尺寸',
		},
		spin:{
			description:'是否旋转',
		},
		style:{
			description:'样式',
		},
		type:{
			description:'iconfont的名字',
		},
		className:{
			description:'类名',
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof IconFont>;
export default meta;

type Story = StoryObj<typeof meta>;
export const iconfont: Story = {
	args: {
		type: "icon-zhangshangcaifuyemianshoujiban345"
	},
};

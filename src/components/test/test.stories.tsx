import Test from './index.tsx'

export default {
  title: 'test',
  component: Test,
  argTypes: {
  }
}

const Template = (args) => {
	return <Test {...args} />
}

export const Primary = Template.bind({})

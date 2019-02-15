import React from 'react';
import Panel from '../../components/Panel';

const WithLayout = (WrappedComponent) => {
  
  return class extends React.Component {
    render () {
      const {
        layout,
        transformLayout,
        parentSize,
        panelKey,
        disableTransitions,
      } = this.props;
      const newLayout = transformLayout(layout, parentSize);
      return (
        <Panel layout={newLayout} disableTransitions={disableTransitions}>
          { calculatedLayout => (
            <WrappedComponent
              panelKey={panelKey}
              {...this.props}
              width={calculatedLayout.width}
              height={calculatedLayout.height}
            />
          )}
        </Panel>
      )
    }
    static defaultProps = {
      transformLayout: layout => layout,
    };
  }
}

export default WithLayout;
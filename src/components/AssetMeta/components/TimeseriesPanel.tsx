import { Timeseries } from '@cognite/sdk';
import { Collapse } from 'antd';
import React from 'react';
import styled from 'styled-components';
import {
  TimeseriesChartMetaProps,
  TimeseriesChartMetaPure,
} from '../../TimeseriesChartMeta/TimeseriesChartMetaPure';

export interface MetaTimeseriesProps
  extends Omit<TimeseriesChartMetaProps, 'timeseries'> {
  strings?: {
    noTimeseriesSign?: string;
  };
}

export interface TimeseriesPanelProps extends MetaTimeseriesProps {
  timeseries?: Timeseries[];
}

export class TimeseriesPanel extends React.PureComponent<TimeseriesPanelProps> {
  static defaultProps = {
    strings: {
      noTimeseriesSign: 'No timeseries linked to this asset',
    },
  };

  render() {
    const { strings, timeseries, ...rest } = this.props;

    if (!timeseries || !timeseries.length) {
      return (
        <NoTimeseries data-test-id="no-timeseries">{`${
          strings!.noTimeseriesSign
        }`}</NoTimeseries>
      );
    }

    return (
      <>
        <TableWrapper>
          <CollapseContainer>
            {timeseries &&
              timeseries.map(ts => (
                <PanelWrapper header={ts.name} key={ts.id.toString()}>
                  <TimeseriesChartMetaPure
                    key={ts.id}
                    timeseries={ts}
                    {...rest}
                  />
                </PanelWrapper>
              ))}
          </CollapseContainer>
        </TableWrapper>
      </>
    );
  }
}

const PanelWrapper = styled(Collapse.Panel)`
  text-align: left;
`;

const TableWrapper = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
`;

const CollapseContainer = styled(Collapse)`
  width: 100%;
`;

const NoTimeseries = styled.div`
  padding: 16px;
`;

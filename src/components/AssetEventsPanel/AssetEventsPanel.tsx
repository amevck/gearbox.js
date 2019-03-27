import React, { Component } from 'react';
import { Table, Modal, Icon } from 'antd';
import { TableColumnType, TableDesignType } from 'utils/validators/AssetTypes';
import { VApiEvent } from 'utils/validators';
import styled from 'styled-components';
import { momentFromTimestamp } from 'utils/formatters';

interface EventAddonsProp extends VApiEvent {
  typeAndSubtype: React.ReactNode;
  description: string;
  start: number;
  end: number;
}

interface AssetEventsPanelProps extends TableDesignType {
  columns?: TableColumnType[];
  events: VApiEvent[];
}

const StyledTable = styled(Table)`
  tr {
    background: white;
    cursor: pointer;
    &:nth-child(2n) {
      background: #fafafa;
    }
  }
  td {
    max-width: 500px;
  }
`;

const EventDetails = styled.div`
  .description {
    font-size: 18px;
    padding-top: 16px;
  }
  .times {
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
  }
`;

const EventMetadataList = styled.div`
  margin-top: 32px;
  max-height: calc(100vh - 400px);
  overflow: auto;
  .event-metadata {
    padding: 16px;
    &:nth-child(2n) {
      background: #fbfbfb;
    }
  }
`;

class AssetEventsPanel extends Component<
  AssetEventsPanelProps,
  { hasSelectedEvent: false }
> {
  constructor(props: AssetEventsPanelProps) {
    super(props);
    this.state = {
      hasSelectedEvent: false,
    };
  }

  renderEventDetails = (event: EventAddonsProp) => (
    <EventDetails key="event-detail">
      <div key="event-type">
        <strong>{event.type},</strong> {event.subtype}
      </div>
      {event.description && (
        <div className="description">{event.description}</div>
      )}
      <div key="event-time" className="times">
        <span>{event.start}</span>
        <span>
          <Icon type="right" />
        </span>
        <span style={{ textAlign: 'right' }}>{event.end}</span>
      </div>
    </EventDetails>
  );

  renderEventMetadata = (event: EventAddonsProp) => (
    <EventMetadataList key="event-metadata">
      {Object.keys(event.metadata || {}).map(key => (
        <div key={key} className="event-metadata">
          <strong>{key}</strong> <br />
          <span>{event.metadata && event.metadata[key]}</span>
        </div>
      ))}
    </EventMetadataList>
  );

  mapEvent = (event: VApiEvent) => ({
    ...event,
    typeAndSubtype: (
      <span>
        <strong style={{ display: 'block' }}>{event.type}</strong>
        <span style={{ fontSize: 12, opacity: 0.8 }}>{event.subtype}</span>
      </span>
    ),
    description: event.description || 'No description',
    start: momentFromTimestamp(event.startTime).format('LLL'),
    end: event.endTime
      ? momentFromTimestamp(event.endTime).format('LLL')
      : 'Ongoing',
  });

  onEventClick = (record: any) => {
    this.setState({
      hasSelectedEvent: record,
    });
  };

  render() {
    const defaultColumns = [
      {
        title: 'Type / Subtype',
        dataIndex: 'typeAndSubtype',
        key: 'typeAndSubtype',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Start',
        dataIndex: 'start',
        key: 'start',
      },
      {
        title: 'End',
        dataIndex: 'end',
        key: 'end',
      },
    ];

    const {
      columns = defaultColumns,
      events,
      pagination = { pageSize: 12 },
      scroll,
      bordered = false,
      showHeader = true,
      style,
    } = this.props;

    const { hasSelectedEvent } = this.state;

    return (
      <>
        <StyledTable
          key="styleTable"
          columns={columns}
          dataSource={events.map(this.mapEvent)}
          rowKey="id"
          showHeader={showHeader}
          pagination={pagination}
          scroll={scroll}
          bordered={bordered}
          style={style}
          onRow={record => ({
            onClick: () => this.onEventClick(record),
          })}
        />
        {typeof hasSelectedEvent && (
          <Modal
            key="Modal"
            visible={!!hasSelectedEvent}
            footer={null}
            onCancel={() => this.setState({ hasSelectedEvent: false })}
          >
            {hasSelectedEvent !== false && [
              this.renderEventDetails(hasSelectedEvent),
              this.renderEventMetadata(hasSelectedEvent),
            ]}
          </Modal>
        )}
      </>
    );
  }
}

export default AssetEventsPanel;
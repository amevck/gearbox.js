import { Button, Icon, Input, Modal } from 'antd';
import AssetSearchForm from 'components/AssetSearchForm/AssetSearchForm';
import RootAssetSelect from 'components/RootAssetSelect/RootAssetSelect';
import { debounce } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import {
  VAsset,
  VId,
  VMetadata,
  VAdvancedSearch,
  VApiQuery,
  VOnAssetSearchResult,
  VOnAssetSearch,
  VOnAssetSelected,
  VEmptyCallback,
} from 'utils/validators';

const InputGroup = styled(Input.Group)`
  display: flex !important;
  flex-grow: 1;
`;

const ButtonBlock = styled(Button)`
  width: 100%;
`;
const RootAssetSelectStyled = styled(RootAssetSelect)`
  width: 35%;
`;

export interface AssetSearchProps {
  onSearchResults: VOnAssetSearchResult;
  onSearch: VOnAssetSearch;
  onAssetSelected: VOnAssetSelected;
  onFilterIconClick: VEmptyCallback;
  fetchingLimit: number;
  debounceTime: number;
  boostName: boolean;
  assets: VAsset[];
  strings: VMetadata;
}

export interface AssetSearchState {
  assetId: VId;
  query: string;
  isModalOpen: boolean;
  advancedSearch: VAdvancedSearch | null;
}

class AssetSearch extends React.Component<AssetSearchProps, AssetSearchState> {
  static defaultProps = {
    fetchingLimit: 25,
    debounceTime: 200,
    boostName: true,
    strings: {
      changeSearch: 'Change search',
      clear: 'Clear',
      searchPlaceholder: 'Search for an asset',
      search: 'Search',
    },
  };

  onSearch = debounce(() => {
    const { onSearch, boostName, fetchingLimit, onSearchResults } = this.props;
    const { query, advancedSearch, assetId } = this.state;
    const assetSubtrees = assetId ? [assetId] : null;

    const apiQuery: VApiQuery = {
      advancedSearch,
      fetchingLimit,
      assetSubtrees,
      boostName,
      query,
    };

    if (!query && !advancedSearch) {
      onSearchResults(null, apiQuery);

      return;
    }

    onSearch(apiQuery);
  }, this.props.debounceTime);

  constructor(props: AssetSearchProps) {
    super(props);
    this.state = {
      assetId: 0,
      query: '',
      isModalOpen: false,
      advancedSearch: null,
    };
  }

  onFilterIconClick = () => {
    const { onFilterIconClick } = this.props;

    onFilterIconClick();

    this.setState({
      isModalOpen: true,
    });
  };

  onModalCancel = () => {
    const { onSearchResults } = this.props;

    this.setState({
      advancedSearch: null,
      isModalOpen: false,
      query: '',
    });

    onSearchResults(null);
  };

  onModalOk = () => {
    this.setState({ isModalOpen: false }, this.onSearch);
  };

  onAssetSelected = (assetId: VId) => {
    const { onAssetSelected } = this.props;

    onAssetSelected(assetId);

    this.setState({ assetId }, this.onSearch);
  };

  render() {
    const { assetId, query, isModalOpen, advancedSearch } = this.state;
    const {
      assets,
      strings: { changeSearch, clear, searchPlaceholder, search },
    } = this.props;

    return (
      <React.Fragment>
        <InputGroup compact={true}>
          <RootAssetSelectStyled
            onAssetSelected={this.onAssetSelected}
            assets={assets}
            assetId={assetId}
          />
          {advancedSearch ? (
            <React.Fragment>
              <ButtonBlock type="primary" onClick={this.onFilterIconClick}>
                {changeSearch}
              </ButtonBlock>
              <Button htmlType="button" onClick={this.onModalCancel}>
                {clear}
              </Button>
            </React.Fragment>
          ) : (
            <Input
              placeholder={searchPlaceholder}
              disabled={!!advancedSearch}
              value={query}
              onChange={e =>
                this.setState({ query: e.target.value }, this.onSearch)
              }
              allowClear={true}
              suffix={
                <Icon
                  type="filter"
                  onClick={() => this.onFilterIconClick()}
                  style={{ opacity: 0.6, marginLeft: 8 }}
                />
              }
            />
          )}
        </InputGroup>
        <Modal
          align={null}
          visible={isModalOpen}
          onCancel={this.onModalCancel}
          footer={[
            <Button htmlType="button" key="cancel" onClick={this.onModalCancel}>
              {clear}
            </Button>,
            <Button
              htmlType="button"
              key="search"
              type="primary"
              onClick={this.onModalOk}
            >
              {search}
            </Button>,
          ]}
        >
          <AssetSearchForm
            value={advancedSearch}
            onPressEnter={this.onModalOk}
            onChange={(value: VAdvancedSearch) =>
              this.setState({ advancedSearch: value, query: '' })
            }
          />
        </Modal>
      </React.Fragment>
    );
  }
}

export default AssetSearch;
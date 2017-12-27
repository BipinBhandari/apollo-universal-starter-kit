import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PagingParams from '../../../common/components/hoc/tables/PagingParams';

import QUERY from '../graphql/GroupsQuery.graphql';

class GroupsTable extends React.Component {
  handleDeleteGroup = async id => {
    const { deleteGroup } = this.props;
    const result = await deleteGroup(id);
    if (result && result.errors) {
      this.setState({ errors: result.errors });
    } else {
      this.setState({ errors: [] });
    }
  };

  render() {
    console.log('GroupTable.props', this.props);

    const columns = [
      {
        id: 'id',
        Header: 'Display Name',
        accessor: row => {
          return { id: row.id, name: row.profile ? row.profile.displayName : row.name };
        },

        filterAccessor: row => row.id.name,
        Cell: props => {
          return <Link to={'/groups/' + props.value.id}>{props.value.name}</Link>;
        }
      },
      {
        id: 'name',
        Header: 'Name',
        accessor: 'name',
        Cell: props => {
          const val = props.value;
          let col = props.column;
          if (col.filter) {
            const f = col.filter;
            if (f) {
              const ts = val.split(f.value);
              return (
                <span>
                  {ts.map((t, idx) => (
                    <span>
                      {t}
                      <b>{idx === ts.length - 1 ? '' : f.value}</b>
                    </span>
                  ))}
                </span>
              );
            }
          }

          return <span>{val}</span>;
        }
      },
      {
        id: 'isActive',
        Header: 'Active',
        accessor: 'isActive',
        Cell: props => {
          return props.value.toString();
        }
      },
      {
        id: 'updatedAt',
        Header: 'Updated At',
        accessor: 'updatedAt',
        Cell: props => {
          return props.value.toString();
        }
      }
    ];

    const tableProps = {
      columns,
      defaultPageSize: 10
    };

    const extract = data => {
      console.log('Extract data', data);
      return data.pagingGroups;
    };

    return <PagingParams tableProps={tableProps} query={QUERY} accessor={extract} />;
  }
}

export default GroupsTable;
/*
 * MIT License
 *
 * Copyright (c) 2019 Crafter Software Corporation. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { useMemo } from 'react';
import Layout from './Layout';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledDropdown
} from 'reactstrap';

import classnames from 'classnames';
import ProfileSettings, { ChangePasswordForm } from './ProfileSettings';
import OrdersList from './OrderList';
import { useDispatch, useSelector } from 'react-redux';
import { logout, removeAddress, setAddressDefaults } from '../../redux/actions/usersActions';
import AddressCard from './AddressCard';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';

import authorized from '../shared/authorized';
import { Empty } from '../shared/Empty';

function Account({ history, match, user }) {

  const dispatch = useDispatch();
  const { orders } = useSelector(state => state.users);

  const activeTab = useMemo(
    () => (
      [
        'profile',
        'orders',
        'address-book',
        'password'
      ].includes(match.params.tab)
        ? match.params.tab
        : 'profile'
    ),
    [match.params.tab]
  );

  const setActiveTab = (tab) => {
    history.push(`/account/${tab}`);
  };
  
  return (
    <Layout>
      <Container>
        <div className="profile">
          <Row>
            <Col md={12} lg={12} xl={4}>
              <Card style={{ height: 'auto' }}>
                <CardBody className="profile__card">
                  <div className="profile__information">
                    <div className="">
                      <p className="profile__name">
                        {`${user.firstName} ${user.middleName || ''} ${user.lastName}`}
                      </p>
                      <p className="profile__work">{user.phone}</p>
                      <p className="profile__contact">{user.email}</p>
                      <Button
                        color="primary"
                        className="icon profile__btn"
                        onClick={() => dispatch(logout(history.push))}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                  {
                    orders &&
                    <div className="profile__stats">
                      <div className="profile__stat">
                        <p className="profile__stat-number">{Object.values(orders).length}</p>
                        <p className="profile__stat-title">Orders</p>
                      </div>
                    </div>
                  }
                </CardBody>
              </Card>
            </Col>
            <Col md={12} lg={12} xl={8}>
              <Card>
                <div className="profile__card tabs tabs--bordered-bottom">
                  <div className="tabs__wrap">
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === 'profile' })}
                          onClick={() => setActiveTab('profile')}
                        >
                          Profile
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === 'address-book' })}
                          onClick={() => setActiveTab('address-book')}
                        >
                          Address Book
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === 'orders' })}
                          onClick={() => setActiveTab('orders')}
                        >
                          Orders
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === 'password' })}
                          onClick={() => setActiveTab('password')}
                        >
                          Password
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="profile">
                        <ProfileSettings initialValues={user}/>
                      </TabPane>
                      <TabPane tabId="address-book">
                        <Row>
                          <Col md={12}>
                            <Button color="primary" onClick={() => history.push('/account/address-book/new')}>
                              Add Address
                            </Button>
                            {
                              (user.addresses == null || user.addresses.length === 0) &&
                              <Empty description="You haven't registered any addresses yet."/>
                            }
                          </Col>
                          {
                            user.addresses && user.addresses.map((address) =>
                              <Col md={4} sm={6} key={address.id}>
                                <Card>
                                  <CardBody>
                                    <AddressCard address={address} user={user}/>
                                    {
                                      (user.addresses.length === 1 || address.isShippingDefault) &&
                                      <div className="address-display__default">
                                        <Badge color="info">Shipping Default</Badge>
                                      </div>
                                    }
                                    {
                                      (user.addresses.length === 1 || address.isBillingDefault) &&
                                      <div className="address-display__default">
                                        <Badge color="success">Billing Default</Badge>
                                      </div>
                                    }
                                    <UncontrolledDropdown>
                                      <DropdownToggle className="icon icon--right btn-sm address-options-btn" outline>
                                        <p>Options <ChevronDownIcon/></p>
                                      </DropdownToggle>
                                      <DropdownMenu className="dropdown__menu">
                                        <DropdownItem
                                          onClick={() => history.push(`/account/address-book/edit/${address.id}`)}>
                                          Edit
                                        </DropdownItem>
                                        <DropdownItem onClick={() => onSetDefaultBilling(address)}>
                                          Set as billing default
                                        </DropdownItem>
                                        <DropdownItem onClick={() => onSetDefaultShipping(address)}>
                                          Set as shipping default
                                        </DropdownItem>
                                        <DropdownItem divider/>
                                        <DropdownItem onClick={() => onRemoveAddress(address.id)}>
                                          Remove
                                        </DropdownItem>
                                      </DropdownMenu>
                                    </UncontrolledDropdown>
                                  </CardBody>
                                </Card>
                              </Col>
                            )
                          }
                        </Row>
                      </TabPane>
                      <TabPane tabId='orders'>
                        <OrdersList/>
                      </TabPane>
                      <TabPane tabId="password">
                        <ChangePasswordForm/>
                      </TabPane>
                    </TabContent>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </Layout>
  );

  function onRemoveAddress(addressId) {
    dispatch(removeAddress(addressId));
  }

  function onSetDefaultBilling(address) {
    const nextAddress = { ...address, isBillingDefault: true };
    onUpdateAddressDefaults(nextAddress);
  }

  function onSetDefaultShipping(address) {
    const nextAddress = { ...address, isShippingDefault: true };
    onUpdateAddressDefaults(nextAddress);
  }

  function onUpdateAddressDefaults(address) {
    dispatch(setAddressDefaults(address));
  }

}

export default authorized(Account);

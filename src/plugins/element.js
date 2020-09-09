import Vue from 'vue'
import {
    Button, Form, Input, FormItem,
    Message, Container, Header, Aside,
    Main, Row, Col, Menu, Submenu,
    MenuItem, MenuItemGroup, Breadcrumb,
    BreadcrumbItem, Card, Table, TableColumn
} from 'element-ui'

Vue.use(Button).use(Form).use(Input).use(FormItem).use(Container).use(Header).use(Aside).use(Main).use(Row).use(Col).use(Menu).use(Submenu)
Vue.use(MenuItem).use(MenuItemGroup).use(Breadcrumb).use(BreadcrumbItem).use(Card).use(Table).use(TableColumn)
Vue.prototype.$message = Message

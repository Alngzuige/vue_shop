import Vue from 'vue'
import {
    Button, Form, Input, FormItem,
    Message, Container, Header, Aside,
    Main, Row, Col, Menu, Submenu,
    MenuItem, MenuItemGroup, Breadcrumb,
    BreadcrumbItem, Card, Table, TableColumn,
    Switch, Tooltip, Pagination, Dialog, MessageBox,
    Tag, Tree, Select, Option
} from 'element-ui'

Vue.use(Button).use(Form).use(Input).use(FormItem).use(Container).use(Header).use(Aside).use(Main).use(Row).use(Col).use(Menu).use(Submenu)
Vue.use(MenuItem).use(MenuItemGroup).use(Breadcrumb).use(BreadcrumbItem).use(Card).use(Table).use(TableColumn)
Vue.use(Switch).use(Tooltip).use(Pagination).use(Dialog).use(Tag).use(Tree).use(Select).use(Option)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm 

import { getModule, getModuleByDisplayName } from '@vizality/webpack';

const ModalRoot = getModule("ModalRoot")
const {Messages} = getModule(m => m.Messages && m.getLocale && m.Messages.CLOSE)
const Button = getModule("ButtonLooks")
const Header = getModule(m => m.displayName && m.displayName === "Header" && m.Sizes)
const Flex = getModuleByDisplayName("Flex")
const Text = getModuleByDisplayName("text")
const Markdown = getModule(m => m.displayName && m.displayName === "Markdown" && m.rules)
const ConfirmationModal = getModuleByDisplayName("ConfirmModal")
const Search = getModuleByDisplayName("Searchbar")
const {openModal} = getModule("openModal", "openModalLazy")

export {
  ModalRoot, Messages, Button, Header, Flex, Text, Markdown, ConfirmationModal, Search, openModal
}
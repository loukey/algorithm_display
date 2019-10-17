
function add_option() {
    const select = document.getElementById("camera-select")
    val = document.getElementById("camera-url")
    const new_option = new Option()
    new_option.text = val.value
    select.add(new_option)
}
function delete_option() {
    const select = document.getElementById("camera-select")
    select.remove(select.selectedIndex)
}

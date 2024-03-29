let nickname = null;

async function joinChat() {
    nickname = $("#nickname").val().trim();
    const userResponse = await fetch(`createUser/${nickname}`, {
        method: "POST"
    });
    const data = await userResponse;
    console.log(data)
    if(data.ok){
        $(".join-form").addClass("hidden")
    }
}

$(function () {
    $("#join").click(() => joinChat());
});




$(document).ready(function () {
    let data = [];

    const list = $(".list");
    const uncompletedNum = $(".num-uncompleted");
    // 畫面暫存狀態：0 - 待完成 / 1 - 已完成 / 2 - 全部
    let statusNow = 2;

    // 顯示 list 內容
    function displayList(status) {
        // 畫面表單清空
        list.empty();
        $.each(data, function (index, object) {
            if(status <= 1 && status != object.status) {
                return;
            }
            let element;
            if(object.status == 0) {
                element = `<li data-num=${index}><div class="checkbox"></div>`;
            } else {
                element = `<li data-num=${index} class="checkbox-checked"><div class="checkbox"></div>`;
            }
            element += `<p>${object.value}</p><div class="list-delete"></div></li>`;
            list.append(element);
        });
    }

    function changeItemStatus(listItem) {
        // 修改項目顯示效果
        listItem.toggleClass("checkbox-checked");
        // 更新暫存 list
        let num = listItem.attr('data-num');
        data[num].status = listItem.hasClass("checkbox-checked") ? 1 : 0;
    }

    function uncompletedCNT(way, element) {
        switch(way) {
            case "add":
                uncompletedNum.text(parseInt(uncompletedNum.text()) + 1);
                break;
            case "change":
                if($(element).hasClass("checkbox-checked")) {
                    uncompletedNum.text(parseInt(uncompletedNum.text()) + 1);
                } else {
                    uncompletedNum.text(parseInt(uncompletedNum.text()) - 1);
                }
                break;
            case "delete":
                if(!$(element).hasClass("checkbox-checked")) {
                    uncompletedNum.text(parseInt(uncompletedNum.text()) - 1);
                }
                break;
        }
    }

    $(".menu").on('click', function (e) {
        // 移除 menu 效果
        $(".menu").children().removeClass("menu-active");
        // 選中 menu 加上效果
        $(e.target).toggleClass("menu-active");
        // 更新暫存狀態
        statusNow = $(e.target).attr("data-status");
        // 更新畫面表單
        displayList(statusNow);
    });

    $(list).on('click', function (e) {
        if(e.target.nodeName === "P") {
            uncompletedCNT("change", $(e.target).parent());
            changeItemStatus($(e.target).parent());
        } else if(e.target.nodeName === "DIV") {
            if($(e.target).hasClass("checkbox")) {
                uncompletedCNT("change", $(e.target).parent());
                changeItemStatus($(e.target).parent());
            } else {
                uncompletedCNT("delete", $(e.target).parent());
                // 刪除單筆
                let num = $(e.target).parent().attr('data-num');
                data.splice(num, 1);
                if(data.length == 0) {
                    $(".main").addClass("list-empty");
                }
            }
        }
        // 更新畫面表單
        displayList(statusNow);
    });

    $(".input input[type='button']").on('click', function (e) {
        let input = $(".input input[type='text']");
        if(input.val().trim() != "") {
            // 更新暫存 list
            const obj = {};
            obj.value = input.val().trim();
            obj.status = "0";
            data.push(obj);
            // 寫入畫面
            if($(".menu-active").attr("data-status") != "1"){
                let element = `<li data-num=${data.length - 1}><div class="checkbox"></div><p>${input.val()}</p><div class="list-delete"></div></li>`;
                list.append(element);
            }
            uncompletedCNT("add");
            // 清空
            input.val("");
        }
        if(data.length == 1){
            $(".main").removeClass("list-empty");
        }
    });

    $(".delete-completed").on('click', function (e) {
        // 篩選出未完成項目
        data = data.filter((item) => item.status == 0);
        // 更新畫面表單
        displayList(statusNow);
        if(data.length == 0) {
            $(".main").addClass("list-empty");
        }
    });

    $(document).on('keypress',function(e) {
        if(e.which == 13) { // enter
            if($(".input input[type='text']").is(":focus")) {
                $(".input input[type='button']").click();
            }
        }
    });
});
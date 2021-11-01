$(document).ready(function () {
    let data = [
        {
            value: "已完成代辦事項", status: 1
        },
        {
            value: "未完成代辦事項", status: 0
        }
    ];

    const list = $(".list-main");
    const uncompleted = $(".uncompleted");
    // 畫面暫存狀態：0 - 待完成 / 1 - 已完成 / 2 - 全部
    let statusNow = 2;

    // 顯示 list 內容
    function displayList(status) {
        let uncompletedCNT = 0;
        // 畫面表單清空
        list.empty();
        $.each(data, function (index, object) {
            if(status <= 1 && status != object.status) {
                return;
            }
            let element;
            if(object.status == 0) {
                uncompletedCNT++;
                element = `<li data-num=${index}><i class="far fa-square list-item"></i>`;
            } else {
                element = `<li data-num=${index} class="list-item-check"><i class="fas fa-check list-item"></i>`;
            }
            element += `<p>${object.value}</p><i class="fas fa-times list-item-delete"></i></li>`;
            list.append(element);
        });
        // 更新待完成筆數
        uncompleted.text(uncompletedCNT);
    }
    function changeItemStatus(checkbox, listItem) {
        // 修改 事項明細 效果
        listItem.toggleClass("list-item-check");
        // 修改 checkbox 圖示
        checkbox.toggleClass("far").toggleClass("fa-square");
        checkbox.toggleClass("fas").toggleClass("fa-check");
        // 更新暫存 list
        let num = listItem.attr('data-num');
        data[num].status = listItem.hasClass("list-item-check") ? 1 : 0;
    }
    displayList(statusNow);

    $(".list-menu").on('click', function (e) {
        $(".list-menu").children().removeClass("list-menu-active");
        $(e.target).toggleClass("list-menu-active");
        // 更新暫存狀態
        statusNow = $(e.target).attr("data-status");
        // 更新畫面表單
        displayList(statusNow);
    });

    $(".list-main").on('click', function (e) {
        if(e.target.nodeName === "P") {
            changeItemStatus($(e.target).parent().find('.list-item'), $(e.target).parent());
        } else if(e.target.nodeName === "I") {
            if($(e.target).hasClass("list-item")) {
                changeItemStatus($(e.target), $(e.target).parent());
            } else if ($(e.target).hasClass("list-item-delete")) { // 刪除單筆
                let num = $(e.target).parent().attr('data-num');
                data.splice(num, 1);
            }
        }
        // 更新畫面表單
        displayList(statusNow);
    });

    $(".addList input[type='button']").on('click', function (e) {
        let input = $(".addList input[type='text']");
        if(input.val().trim() != "") {
            // 更新暫存 list
            const obj = {};
            obj.value = input.val().trim();
            obj.status = "0";
            data.push(obj);
            // 寫入畫面
            let element = `<li  data-num=${data.length - 1}><i class="far fa-square list-item"></i>`;
            element += `<p>${input.val()}</p>`;
            element += `<i class="fas fa-times list-item-delete"></i></li>`;
            list.append(element);
            // 清空
            input.val("");
        }
    });

    $(".delete-completed").on('click', function (e) {
        // 篩選出未完成
        let filter = data.filter((item) => item.status == 0);
        // 更新表單
        data = filter;
        // 更新畫面表單
        displayList(statusNow);
    });
});
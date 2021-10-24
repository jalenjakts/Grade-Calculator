let rowIdx = 0;
let rowCount = 0;

function showTable() {
    $('#studentList').change(function() {
        $('#gradeTable').show();
        $('#addButton').show();
        $('#submitButton').show();
        $('#addButton').click();
    })
}

function addNewGrade() {
    $('#addButton').on('click', function() {
        $('tbody').append(
            `<tr class="text-center" id=${++rowIdx}>
            <th>${rowIdx}</th>
            <td>
                <select class="form-control" name="gradeType${rowIdx}" id="gradeType${rowIdx}">
                    <option disable selected value></option>
                    <option value="Homework Assignment">Homework Assignment</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Project Assignment">Project Assignment</option>
                    <option value="Test">Test</option>
                </select>
            </td>
            <td>
                <input type="text" class="form-control" id="gradeName${rowIdx}" name='gradeName${rowIdx}' placeholder="Assignment Name">
            </td>
            <td>
                <input type="text" class="form-control" id="gradePercent${rowIdx}" name='gradePercent${rowIdx}' placeholder="Weight Percent">
            </td>
            <td>
                <input type="text" class="form-control" id="gradeValue${rowIdx}" name='gradeValue${rowIdx}' placeholder="Grade Score">
            </td>
            <td>
                <button type="button" class="btn btn-outline-danger remove"><i class="fas fa-trash"></i></button>
            </td>
            </tr>
        `)
        rowCount++;
        $('#totalCount').val(rowCount);
    })
}

function removeButton() {
    $('tbody').on('click', '.remove', function() {
        var child = $(this).closest('tr').nextAll();

        child.each(function() {
            var id = $(this).attr('id');
            var gradeType = $(this).children('#gradeType');
            var gradeName = $(this).children('#gradeName');
            var gradePercent = $(this).children('#gradePercent');
            var gradeValue = $(this).children('#gradeValue');
            var dig = parseInt(id.substring(1));
            gradeType.attr('id', `gradeType${dig - 1}`);
            gradeName.attr('id', `gradeName${dig - 1}`);
            gradePercent.attr('id', `gradePercent${dig - 1}`);
            gradeValue.attr('id', `gradeValue${dig - 1}`);
        });

        $(this).closest('tr').remove();

        rowIdx--;
        rowCount--;
        $('#totalCount').val(rowCount);
    })
}
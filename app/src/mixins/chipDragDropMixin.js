import {
  addClass,
  uid,
  removeClass
} from "../modules/misc";
import _forEach from "lodash/forEach";
import _debounce from "lodash/debounce";
import _delay from "lodash/delay";

const chipDragDropMixin = {
  data: function () {
    return {
      isDraggingChip: false,
      chipIsDropping: false
    }
  },
  methods: {
    dragStart: function (data, event) {
      console.log("Drag start", data);
      console.log("chipEmailType : ", this.$parent.$parent.emailType);

      var [chip, chipId] = cloneDraggableChip(event.target);
      var chipData = {
        data: data,
        chipId: chipId,
        chipEmailType: this.$parent.$parent.emailType,
        position: {
          x: event.clientX - event.offsetX - 1,
          y: event.clientY - event.offsetY - 1,
          offsetX: event.offsetX,
          offsetY: event.offsetY
        }
      };
      var dragImage = new Image(0, 0);

      this.$store.commit("changeChipData", chipData);
      this.$store.commit("changeFakeChip", chip);

      dragImage.style.opacity = 0;

      addClass(chip, "email-chip--floating");
      chip.style.left = `${chipData.position.x}px`;
      chip.style.top = `${chipData.position.y}px`;

      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", JSON.stringify(chipData));
      event.dataTransfer.setDragImage(dragImage, 0, 0);

      this.isDraggingChip = true;
    },
    dragging: _debounce(function (event) {
      console.log("dragging", this.isDraggingChip);
      var $storeStates = this.$store.state.dragDropStates;

      if ($storeStates.fakeChip && this.isDraggingChip == true) {
        $storeStates.fakeChip.style.left = `${event.clientX - $storeStates.chipData.position.offsetX}px`;
        $storeStates.fakeChip.style.top = `${event.clientY - $storeStates.chipData.position.offsetY}px`;
      }

    }, 10),
    dropped: function (droppedAtEmailType, event) {
      console.log("dropping at : ", droppedAtEmailType);
      event.dataTransfer.dropAllowed = "move";
      this.$store.commit("toggleChipisDropped", true);
      
      var $storeStates = this.$store.state.dragDropStates;
      var dropped = new Promise((resolve, reject) => {
        // Check whether it was dropped in the same EmailBox the chip was from
        if ($storeStates.chipData.chipEmailType === droppedAtEmailType) {
          // this will act like it was not dropped
          this.$store.commit("toggleChipisDropped", false);
          this.chipIsDropping = false;

          resolve(true);
        } else {
          this.addEmail($storeStates.chipData.data.email)
            .then(async () => {
              console.log("email added at : ", droppedAtEmailType);
              await this.$nextTick();
              
              var newChip = document.querySelector(`#emails-${droppedAtEmailType} li.email-chip:nth-child(${this.emails.length})`);
              await this.$nextTick();
              await animateChipToChip($storeStates.fakeChip, newChip.getBoundingClientRect());
              
              console.log("dropped, chipIsDropped: ", $storeStates.chipIsDropped);
              
              removeClass($storeStates.fakeChip, "email-chip--floating");
              resolve(this);

              this.chipIsDropping = false;
              this.$store.commit("toggleChipisDropped", false);
              
              removeFakeChips();
            });
        }
      });

      this.$store.commit("changeDropIsComplete", dropped);
    },
    dragEnd: function (event) {
      this.isDraggingChip = false;
      // have to delay to make sure ondrop fires first
      _delay(() => {
        var $storeStates = this.$store.state.dragDropStates;
        console.log("Drag ending, chipIsDropped: ", $storeStates.chipIsDropped);

        // if the ondrop was NOT triggered
        if ($storeStates.chipIsDropped == false) {
          animateChipToChip($storeStates.fakeChip, $storeStates.chipData.position)
            .then(() => {
              console.log("[animateChipToChip] end");
              removeClass($storeStates.fakeChip, "email-chip--floating");
              this.$store.commit("changeFakeChip", null);
              this.$store.commit("changeChipData", {});

              removeFakeChips();
            });
        } else {
          // ondrop was triggered BUT NEEDS to wait for ondrop to finish
          $storeStates.dropIsComplete.then((_this) => {
            console.log("[dropIsComplete]");

            this.$parent.$parent.removeEmail($storeStates.chipData.data.index)
              .then(() => {
                this.$parent.$nextTick().then(() => {
                  this.$store.commit("changeFakeChip", null);
                  this.$store.commit("changeChipData", {});
                  this.$store.commit("changeDropIsComplete", null);
                  this.$store.commit("toggleChipisDropped", false);
                });
              });
          });
        }
      }, 150);
    }
  }
};

function removeFakeChips() {
  var fakeChips = document.querySelectorAll("[id*='chip--fake-']");
  _forEach(fakeChips, (chip) => chip.remove());
}

function cloneDraggableChip(node) {
  var newNode = node.cloneNode(true);

  newNode.id = uid("chip--fake-");
  newNode.style.position = "fixed";
  newNode.style.zIndex = "999999999";
  newNode.setAttribute("draggable", "false");
  removeClass(newNode, "email-chip--is-dragging");

  document.body.appendChild(newNode);

  return [newNode, newNode.id];
}

function animateChipToChip(chip, { x, y }) {
  return new Promise((resolve, reject) => {
    chip.animate([{
        left: chip.style.left,
        top: chip.style.top
      },
      {
        left: `${x}px`,
        top: `${y}px`,
      }
    ], {
      duration: 440,
      direction: "normal",
      fill: "forwards",
      easing: "cubic-bezier(0.215, 0.610, 0.355, 1)"
    });

    _delay(() => {
      chip.style.left = `${x}px`;
      chip.style.top = `${y}px`;
      resolve(true);
    }, 800);

  });
}

export default chipDragDropMixin;
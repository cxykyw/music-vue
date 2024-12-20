<template>
  <div class="upgrade-content">
    <div class="upgrade-container">
      <!-- 升级信息 -->
      <div class="upgrade-info">
        <h1>订阅 Music Premium，畅享无广告打扰、支持离线播放的音乐体验，即使屏幕关闭也能享不停</h1>
        <p>JP¥1,080/月·随时可以取消</p>
        <button class="trial-btn">订阅 Music Premium</button>
        <div class="other-plans">
          也可选择<a href="#" class="plan-link">包年方案</a>、<a href="#" class="plan-link">家庭方案</a>或<a href="#" class="plan-link">学生方案</a>，轻松省更多
        </div>
      </div>

      <!-- 会员权益 -->
      <div class="benefits">
        <div class="benefit-item">
          <i class="fas fa-ban"></i>
          <div class="benefit-text">
            <h3>无广告音乐体验</h3>
            <p>畅听音乐，不被广告打断</p>
          </div>
        </div>
        <div class="benefit-item">
          <i class="fas fa-download"></i>
          <div class="benefit-text">
            <h3>离线播放</h3>
            <p>下载音乐，随时随地收听</p>
          </div>
        </div>
        <div class="benefit-item">
          <i class="fas fa-mobile-alt"></i>
          <div class="benefit-text">
            <h3>后台播放</h3>
            <p>锁屏或使用其他应用时继续播放</p>
          </div>
        </div>
      </div>

      <!-- 底部说明 -->
      <div class="bottom-content">
        <p>定期付费订阅。仅限新Music Premium订阅者。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 保持空的setup,因为我们现在只需要静态展示
</script>

<style scoped>
@import '../assets/styles/upgrade.css';
</style> 